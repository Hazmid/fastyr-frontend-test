// types.ts

// User related types
export interface User {
    id?: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    website?: string;
    address?: Address;
    company?: Company;
  }
  
  export interface Address {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
    geo: Geo;
  }
  
  export interface Geo {
    lat: string;
    lng: string;
  }
  
  export interface Company {
    name: string;
    catchPhrase?: string;
    bs?: string;
  }
  
  // Album related types
  export interface Album {
    id?: string;
    title: string;
    userId: string;
    user?: User;
    photos?: PhotoConnection;
  }
  
  export interface PhotoConnection {
    data: Photo[];
    meta: Meta;
  }
  
  export interface Photo {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    albumId: string;
  }
  
  export interface Meta {
    totalCount: number;
  }
  
  export interface AddressInput {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
    geo?: GeoInput;
  }
  
  export interface GeoInput {
    lat: string;
    lng: string;
  }
  
  export interface CompanyInput {
    name: string;
    catchPhrase?: string;
    bs?: string;
  }
  
  