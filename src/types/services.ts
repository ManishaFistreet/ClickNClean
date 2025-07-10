import { Dayjs } from 'dayjs';

export type ServiceMaster = {
  _id: string;
  serviceCode: string;
  serviceName: string;
  serviceDetail: string;
  minHours: number;
  maxHours: number;
  currentActivePrice: number;
  showoffPriceTag: number;
  priceType: string;
  minPersonRequired: number;
  serviceCategory: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  column6?: string;
  serviceActiveStatus: boolean;
  serviceAppIcon?: string;
  serviceWebImage?: string;
  serviceMappedAdvertisementUniqueId?: string;
};

export type ServicePrice = {
  _id: string;
  serviceCode: string;
  actualPrice: number;
  uniqueId: string;
  priceType: string;
  showoffPrice: number;
  offerCode?: string;
  minDiscount?: number;
  maxDiscount?: number;
  specialDiscount?: number;
  offerDiscount?: number;
  offerStart?: Date;
  offerEnd?: Date;
  proportionalChargesExtraHours?: number;
  proportionalExtraHours?: number;
  minPersonRequired?: number;
  priceActiveStatus: boolean;
  pkgUniqueId: string;
};

export type PackageService = {
  _id: string;
  uniqueId: string;
  mappedServiceCode: string;
  packageName: string;
  packagePriceId: string;
  packagePrice: number;
  mappedPriceMaster: string;
  packageDetail: string;
  packageImageWeb: string;
  packageImageApp?: string;
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
};

export type ServiceShowcase = {
  _id: string;
  uniqueId: string;
  adDetail: string;
  adTitle: string;
  adImageApp?: string;
  adImageWeb?: string;
  adActiveStatus: boolean;
  showcaseStartTime: string;
  showcaseEndTime: string;
  showcaseStartDate: string;
  showcaseEndDate: string;
  adPriceId: string;
};

export type EnhancedService = ServiceMaster & {
  prices?: ServicePrice[];
  showcase?: ServiceShowcase;
};

export type EnhancedPackage = PackageService & {
  includedServices?: ServiceMaster[];
  includedPrices?: ServicePrice[];
};

export type CartItemBase = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  icon?: string;
  type: 'service' | 'package';
  includedServices?: ServiceMaster[];
};

export type CartItem = CartItemBase & {
  quantity: number;
};

export interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
  profilePhoto?: string;
  createdAt?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
}

export interface OrderBookingFormValues {
  uniqueId: string;
  booking_id: string;
  service_category: string;
  service_code: string;
  offer_code: string;
  package_code: string;
  price_type: string;
  final_discount: string;
  taxable_value: string;
  total_value: string;
  total_value_per_service: string;
  gst_per_service: string;
  gst_per_service_pert: string;
  grandTotal: string;
}

export interface PackageData {
  UniqueId: string;
  packageName: string;
  packageDetail: string;
  mappedServiceCode: string;
  packagePriceId: string;
  mappedPriceMaster: string;
}

export interface LoginLog {
  uniqueId: string;
  ipAddress: string;
  loginDate: string; 
  loginTime: string;
  loginLatitude: string;
  loginLongitude: string;
  loggedInBy: 'app' | 'web';
  loginAddress: string;
}

export interface ServicePersonFormValues {
  name: string;
  phone: string;
  email: string;
  profilephoto?: {
    uid: string;
    name: string;
    status: string;
    url?: string;
    originFileObj?: File;
  }[];
  city: string;
  state: string;
  street: string;
  zipCode: string;
  categories: string;
  dateTime: Dayjs;
}
export interface PriceFormValues {
  serviceCode: string;
  pkgUniqueId?: string;
  uniqueId?: string;

  minDiscount?: string;
  maxDiscount?: string;
  specialDiscount?: string;

  priceType?: boolean;
  showoffPrice?: string;
  priceActiveStatus?: boolean;

  offerDiscount?: string;
  offerCode?: string;
  actualPrice?: string;

  offerStart?: Dayjs;
  offerEnd?: Dayjs;

  minPersonRequired?: string;
  proportionalChargesExtraHours?: string;
  proportionalExtraHours?: string;
}