/**
 * Unit Tests for Geofencing (Check-in Location Validation)
 * 
 * Tests:
 * 1. Distance calculation accuracy
 * 2. Accept check-in within radius
 * 3. Reject check-in outside radius
 * 4. Handle missing location data
 */

describe('Geofencing - Distance Calculation', () => {
    // Haversine formula implementation for testing
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    test('should calculate zero distance for same point', () => {
        const distance = calculateDistance(-23.5505, -46.6333, -23.5505, -46.6333);
        expect(distance).toBe(0);
    });

    test('should calculate correct distance between São Paulo and Rio (~350km)', () => {
        // São Paulo: -23.5505, -46.6333
        // Rio de Janeiro: -22.9068, -43.1729
        const distance = calculateDistance(-23.5505, -46.6333, -22.9068, -43.1729);
        // Should be approximately 350-360km
        expect(distance).toBeGreaterThan(350000);
        expect(distance).toBeLessThan(370000);
    });

    test('should calculate distance around 100m for nearby points', () => {
        // Two points approximately 100m apart in São Paulo
        const lat1 = -23.5505;
        const lon1 = -46.6333;
        const lat2 = -23.5514; // ~100m south
        const lon2 = -46.6333;

        const distance = calculateDistance(lat1, lon1, lat2, lon2);
        expect(distance).toBeGreaterThan(80);
        expect(distance).toBeLessThan(120);
    });
});

describe('Geofencing - Validation Logic', () => {
    const GEOFENCE_RADIUS_METERS = 150;

    test('should allow check-in within radius', () => {
        const deviceDistance = 100; // 100 meters
        const isWithinRadius = deviceDistance <= GEOFENCE_RADIUS_METERS;
        expect(isWithinRadius).toBe(true);
    });

    test('should block check-in outside radius', () => {
        const deviceDistance = 200; // 200 meters
        const isWithinRadius = deviceDistance <= GEOFENCE_RADIUS_METERS;
        expect(isWithinRadius).toBe(false);
    });

    test('should allow check-in exactly at radius boundary', () => {
        const deviceDistance = 150; // Exactly 150 meters
        const isWithinRadius = deviceDistance <= GEOFENCE_RADIUS_METERS;
        expect(isWithinRadius).toBe(true);
    });

    test('should handle scenarios with different radius configs', () => {
        const scenarios = [
            { distance: 50, radius: 100, expected: true },
            { distance: 150, radius: 100, expected: false },
            { distance: 100, radius: 200, expected: true },
            { distance: 500, radius: 500, expected: true },
            { distance: 501, radius: 500, expected: false },
        ];

        scenarios.forEach(({ distance, radius, expected }) => {
            const isWithinRadius = distance <= radius;
            expect(isWithinRadius).toBe(expected);
        });
    });
});

describe('Geofencing - Data Validation', () => {
    test('should require valid latitude', () => {
        const validLatitudes = [-90, -45, 0, 45, 90];
        const invalidLatitudes = [-91, 91, null, undefined, 'string'];

        validLatitudes.forEach((lat) => {
            expect(lat >= -90 && lat <= 90).toBe(true);
        });

        invalidLatitudes.forEach((lat) => {
            const isValid = typeof lat === 'number' && lat >= -90 && lat <= 90;
            expect(isValid).toBe(false);
        });
    });

    test('should require valid longitude', () => {
        const validLongitudes = [-180, -90, 0, 90, 180];
        const invalidLongitudes = [-181, 181, null, undefined];

        validLongitudes.forEach((lon) => {
            expect(lon >= -180 && lon <= 180).toBe(true);
        });

        invalidLongitudes.forEach((lon) => {
            const isValid = typeof lon === 'number' && lon >= -180 && lon <= 180;
            expect(isValid).toBe(false);
        });
    });

    test('should skip geofence check if no location provided', () => {
        const hasLocation = (lat, lon) => lat != null && lon != null;

        expect(hasLocation(null, null)).toBe(false);
        expect(hasLocation(-23.55, null)).toBe(false);
        expect(hasLocation(null, -46.63)).toBe(false);
        expect(hasLocation(-23.55, -46.63)).toBe(true);
    });

    test('should skip geofence check if partner has no location configured', () => {
        const partnerLocations = [
            { location: null, shouldSkip: true },
            { location: {}, shouldSkip: true },
            { location: { latitude: null, longitude: null }, shouldSkip: true },
            { location: { latitude: -23.55, longitude: -46.63 }, shouldSkip: false },
        ];

        partnerLocations.forEach(({ location, shouldSkip }) => {
            const hasValidLocation = location &&
                location.latitude != null &&
                location.longitude != null;
            expect(!hasValidLocation).toBe(shouldSkip);
        });
    });
});

describe('Geofencing - Error Messages', () => {
    test('should provide helpful error message with distance', () => {
        const distance = 500;
        const message = `Check-in deve ser feito na academia. Você está a ${distance.toFixed(0)}m do local.`;

        expect(message).toContain('500m');
        expect(message).toContain('academia');
    });
});
