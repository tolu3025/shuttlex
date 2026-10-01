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
    price: 3.50,
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
    name: 'Bolt',
    category: 'Recommended',
    etaMins: 5,
    seats: 4,
    price: 9.50,
    description: 'Mid-size cars',
  ),
  const VehicleOption(
    id: 'basic',
    name: 'Basic',
    category: 'Cheaper',
    etaMins: 8,
    seats: 4,
    price: 6.50,
    description: 'Affordable rides',
  ),
  const VehicleOption(
    id: 'comfort',
    name: 'Comfort',
    category: 'Faster',
    etaMins: 2,
    seats: 4,
    price: 10.20,
    description: 'Full-size cars',
  ),
  const VehicleOption(
    id: 'taxi',
    name: 'Taxi',
    category: 'Cheaper',
    etaMins: 4,
    seats: 4,
    price: 9.50,
    description: 'Local taxi rides',
  ),
];
