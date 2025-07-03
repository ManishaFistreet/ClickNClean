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
  showcaseStartDate: Date;
  showcaseEndDate: Date;
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