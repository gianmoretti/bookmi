export type Location = {
  city: string;
  province: string;
  address: string;
};

export type Shop = {
  name: string;
  description: string;
  location: Location;
  services: Service[];
  rules: Rules[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: Number;
};

export type Rules = {
  dayFrom: DayOfWeek;
  dayTo: DayOfWeek;
  timeFrom: Date;
  timeTo: Date;
};

enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturddy = 6,
}
export type Reservation = {
  shopId: string;
  serviceId: string;
  customerId: string;
  from: string;
  to: string;
};
