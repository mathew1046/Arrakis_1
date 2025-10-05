import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Camera,
  Tag,
  Eye,
  Heart,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface PropItem {
  id: string;
  name: string;
  category: string;
  description: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  rentalPrice?: number;
  salePrice?: number;
  availability: 'available' | 'rented' | 'sold' | 'maintenance';
  location: string;
  owner: string;
  dateAdded: Date;
  tags: string[];
  specifications?: { [key: string]: string };
  rating: number;
  reviews: number;
}

interface MarketplaceFilter {
  category: string;
  condition: string;
  availability: string;
  priceRange: [number, number];
  location: string;
}

export const PropsMarketplace: React.FC = () => {
  const [props, setProps] = useState<PropItem[]>([]);
  const [filteredProps, setFilteredProps] = useState<PropItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProp, setSelectedProp] = useState<PropItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilter>({
    category: 'all',
    condition: 'all',
    availability: 'all',
    priceRange: [0, 100000],
    location: 'all'
  });

  useEffect(() => {
    // Initialize demo props data
    const demoProps: PropItem[] = [
      {
        id: '1',
        name: 'Vintage Camera Set',
        category: 'Camera Equipment',
        description: 'Professional vintage camera collection including multiple lenses and accessories. Perfect for period films.',
        condition: 'excellent',
        images: ['/api/placeholder/300/200'],
        rentalPrice: 5000,
        salePrice: 45000,
        availability: 'available',
        location: 'Mumbai',
        owner: 'Production House A',
        dateAdded: new Date(2024, 8, 15),
        tags: ['vintage', 'camera', 'professional', 'period'],
        specifications: {
          'Brand': 'Leica',
          'Model': 'M6 Classic',
          'Year': '1984',
          'Condition': 'Fully functional'
        },
        rating: 4.8,
        reviews: 12
      },
      {
        id: '2',
        name: 'Royal Throne Chair',
        category: 'Furniture',
        description: 'Ornate golden throne chair with velvet cushioning. Ideal for royal or fantasy scenes.',
        condition: 'good',
        images: ['/api/placeholder/300/200'],
        rentalPrice: 3000,
        availability: 'available',
        location: 'Chennai',
        owner: 'Art Department Studios',
        dateAdded: new Date(2024, 8, 20),
        tags: ['throne', 'royal', 'fantasy', 'furniture'],
        specifications: {
          'Material': 'Wood with gold plating',
          'Dimensions': '120cm H x 80cm W',
          'Weight': '25kg'
        },
        rating: 4.5,
        reviews: 8
      },
      {
        id: '3',
        name: 'Medieval Sword Collection',
        category: 'Weapons & Props',
        description: 'Set of 5 medieval swords with different designs. Made from safe materials for film use.',
        condition: 'excellent',
        images: ['/api/placeholder/300/200'],
        rentalPrice: 2500,
        salePrice: 18000,
        availability: 'rented',
        location: 'Hyderabad',
        owner: 'Props Unlimited',
        dateAdded: new Date(2024, 7, 10),
        tags: ['medieval', 'sword', 'weapons', 'fantasy'],
        specifications: {
          'Material': 'Aluminum alloy',
          'Count': '5 pieces',
          'Safety': 'Blunt edges, film-safe'
        },
        rating: 4.9,
        reviews: 15
      },
      {
        id: '4',
        name: 'Vintage Car - 1960s Ambassador',
        category: 'Vehicles',
        description: 'Classic Indian Ambassador car in working condition. Perfect for period films set in 1960s-80s.',
        condition: 'good',
        images: ['/api/placeholder/300/200'],
        rentalPrice: 8000,
        availability: 'available',
        location: 'Delhi',
        owner: 'Classic Cars Rental',
        dateAdded: new Date(2024, 8, 5),
        tags: ['vintage', 'car', 'ambassador', 'period'],
        specifications: {
          'Make': 'Hindustan Ambassador',
          'Year': '1965',
          'Color': 'Cream',
          'Condition': 'Running, restored'
        },
        rating: 4.6,
        reviews: 6
      },
      {
        id: '5',
        name: 'Period Costume Set - Victorian Era',
        category: 'Costumes',
        description: 'Complete Victorian era costume collection for men and women. Various sizes available.',
        condition: 'excellent',
        images: ['/api/placeholder/300/200'],
        rentalPrice: 1500,
        salePrice: 12000,
        availability: 'available',
        location: 'Bangalore',
        owner: 'Costume Corner',
        dateAdded: new Date(2024, 8, 25),
        tags: ['victorian', 'costume', 'period', 'clothing'],
        specifications: {
          'Era': 'Victorian (1837-1901)',
          'Sizes': 'S, M, L, XL',
          'Pieces': '8 complete outfits',
          'Gender': 'Male & Female'
        },
        rating: 4.7,
        reviews: 10
      }
    ];

    setProps(demoProps);
    setFilteredProps(demoProps);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = props;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(prop =>
        prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(prop => prop.category === filters.category);
    }

    // Condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(prop => prop.condition === filters.condition);
    }

    // Availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(prop => prop.availability === filters.availability);
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(prop => prop.location === filters.location);
    }

    setFilteredProps(filtered);
  }, [searchQuery, filters, props]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rented':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sold':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handlePropClick = (prop: PropItem) => {
    setSelectedProp(prop);
    setShowDetailModal(true);
  };

  const categories = [...new Set(props.map(prop => prop.category))];
  const locations = [...new Set(props.map(prop => prop.location))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Props Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Rent or buy props and costumes from our inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            List Item
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search props, costumes, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.condition}
              onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>

            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
            </select>

            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredProps.length} item{filteredProps.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Props Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        {filteredProps.map((prop, index) => (
          <motion.div
            key={prop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handlePropClick(prop)}
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Image */}
            <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'} bg-gray-200 dark:bg-gray-700 relative`}>
              <img
                src={prop.images[0]}
                alt={prop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(prop.availability)}`}>
                  {prop.availability}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {prop.name}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {prop.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {prop.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(prop.condition)}`}>
                  {prop.condition}
                </span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  {prop.location}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {prop.rentalPrice && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rent: </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ₹{prop.rentalPrice}/day
                      </span>
                    </div>
                  )}
                  {prop.salePrice && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Buy: </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        ₹{prop.salePrice}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {prop.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {tag}
                  </span>
                ))}
                {prop.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    +{prop.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Prop Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Prop Details"
        size="xl"
      >
        {selectedProp && (
          <div className="space-y-6">
            {/* Images */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={selectedProp.images[0]}
                alt={selectedProp.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {selectedProp.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionColor(selectedProp.condition)}`}>
                      {selectedProp.condition}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getAvailabilityColor(selectedProp.availability)}`}>
                      {selectedProp.availability}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedProp.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({selectedProp.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {selectedProp.rentalPrice && (
                    <div className="mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rental: </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₹{selectedProp.rentalPrice}/day
                      </span>
                    </div>
                  )}
                  {selectedProp.salePrice && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sale: </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{selectedProp.salePrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedProp.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Category:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {selectedProp.category}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Location:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {selectedProp.location}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Owner:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {selectedProp.owner}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Listed:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {selectedProp.dateAdded.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {selectedProp.specifications && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(selectedProp.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProp.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              {selectedProp.rentalPrice && selectedProp.availability === 'available' && (
                <Button variant="secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Rent Now
                </Button>
              )}
              {selectedProp.salePrice && selectedProp.availability === 'available' && (
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
