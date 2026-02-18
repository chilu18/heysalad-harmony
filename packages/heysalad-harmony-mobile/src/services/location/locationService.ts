import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationWithAddress extends LocationCoordinates {
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

class LocationService {
  async requestPermissions(): Promise<boolean> {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    return foregroundStatus === 'granted' && backgroundStatus === 'granted';
  }

  async checkPermissions(): Promise<{
    foreground: boolean;
    background: boolean;
  }> {
    const foregroundStatus = await Location.getForegroundPermissionsAsync();
    const backgroundStatus = await Location.getBackgroundPermissionsAsync();

    return {
      foreground: foregroundStatus.status === 'granted',
      background: backgroundStatus.status === 'granted',
    };
  }

  async getCurrentLocation(): Promise<LocationCoordinates> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      altitude: location.coords.altitude || undefined,
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
    };
  }

  async getLocationWithAddress(): Promise<LocationWithAddress> {
    const coordinates = await this.getCurrentLocation();
    
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      return {
        ...coordinates,
        address: [address.street, address.streetNumber].filter(Boolean).join(' '),
        city: address.city || undefined,
        country: address.country || undefined,
        postalCode: address.postalCode || undefined,
      };
    } catch (error) {
      console.error('Error getting address:', error);
      return coordinates;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  isWithinRadius(
    currentLat: number,
    currentLon: number,
    targetLat: number,
    targetLon: number,
    radiusMeters: number = 100
  ): boolean {
    const distance = this.calculateDistance(
      currentLat,
      currentLon,
      targetLat,
      targetLon
    );
    return distance <= radiusMeters;
  }

  async verifyWarehouseLocation(
    warehouseLat: number,
    warehouseLon: number,
    allowedRadiusMeters: number = 100
  ): Promise<{
    isValid: boolean;
    distance: number;
    currentLocation: LocationCoordinates;
  }> {
    const currentLocation = await this.getCurrentLocation();
    const distance = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      warehouseLat,
      warehouseLon
    );

    return {
      isValid: distance <= allowedRadiusMeters,
      distance,
      currentLocation,
    };
  }
}

export default new LocationService();