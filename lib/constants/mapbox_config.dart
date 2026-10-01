class MapboxConfig {
  // Official Mapbox Public Access Token (configured via --dart-define=MAPBOX_ACCESS_TOKEN or .env)
  static const String token = String.fromEnvironment(
    'MAPBOX_ACCESS_TOKEN',
    defaultValue: '',
  );

  // Official Mapbox Streets v12 512px @2x Retina Tiles
  static String get streetsTilesUrl => token.isNotEmpty
      ? 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=$token'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Official Mapbox Light v11 Navigation Style Tiles
  static String get lightTilesUrl =>
      'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=$token';

  // Official Mapbox Dark v11 Style Tiles
  static String get darkTilesUrl =>
      'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=$token';

  // Mapbox Geocoding & Campus Search Endpoint
  static String getGeocodingUrl(String query, double proximityLng, double proximityLat) =>
      'https://api.mapbox.com/geocoding/v5/mapbox.places/${Uri.encodeComponent(query)}.json?proximity=$proximityLng,$proximityLat&country=ng&access_token=$token';

  // Mapbox Directions & Routing API
  static String getDirectionsUrl(double startLng, double startLat, double endLng, double endLat) =>
      'https://api.mapbox.com/directions/v5/mapbox/driving/$startLng,$startLat;$endLng,$endLat?geometries=geojson&overview=full&steps=true&access_token=$token';
}
