class LocationPoint {
  final String name;
  final String description;
  final double latitude;
  final double longitude;

  const LocationPoint({
    required this.name,
    this.description = '',
    required this.latitude,
    required this.longitude,
  });
}

class BikeModelInfo {
  final String make;
  final String model;
  final String plateNumber;
  final bool helmetProvided;

  const BikeModelInfo({
    required this.make,
    required this.model,
    required this.plateNumber,
    this.helmetProvided = true,
  });
}

class VehicleOption {
  final String id;
  final String name;
  final String category;
  final int etaMins;
  final int seats;
  final double price;
  final String description;
  final bool isRecommended;
  final bool isBike;
  final BikeModelInfo? bikeModel;

  const VehicleOption({
    required this.id,
    required this.name,
    required this.category,
    required this.etaMins,
    required this.seats,
    required this.price,
    required this.description,
    this.isRecommended = false,
    this.isBike = false,
    this.bikeModel,
  });
}

final List<VehicleOption> kDefaultVehicles = [
  const VehicleOption(
    id: 'bike',
    name: 'Campus Bike',
    category: 'Faster',
    etaMins: 2,
    seats: 1,
    price: 400.0,
    description: 'Honda Ace CB125 • Helmet included',
    isRecommended: true,
    isBike: true,
    bikeModel: BikeModelInfo(
      make: 'Honda',
      model: 'Ace CB125',
      plateNumber: 'KJA-482-XY',
      helmetProvided: true,
    ),
  ),
  const VehicleOption(
    id: 'bolt',
    name: 'Shuttle Express',
    category: 'Recommended',
    etaMins: 4,
    seats: 1,
    price: 500.0,
    description: 'Quick campus motorcycle ride',
    isBike: true,
    bikeModel: BikeModelInfo(
      make: 'Bajaj',
      model: 'Boxer BM150',
      plateNumber: 'AGL-934-LA',
      helmetProvided: true,
    ),
  ),
  const VehicleOption(
    id: 'basic',
    name: 'Campus Carpool',
    category: 'Cheaper',
    etaMins: 6,
    seats: 4,
    price: 300.0,
    description: 'Shared campus bus/van',
  ),
  const VehicleOption(
    id: 'comfort',
    name: 'Campus Comfort',
    category: 'Faster',
    etaMins: 3,
    seats: 4,
    price: 1000.0,
    description: 'Private car ride across campus',
  ),
  const VehicleOption(
    id: 'taxi',
    name: 'Faculty Cab',
    category: 'Cheaper',
    etaMins: 5,
    seats: 4,
    price: 800.0,
    description: 'Campus gate taxi service',
  ),
];
