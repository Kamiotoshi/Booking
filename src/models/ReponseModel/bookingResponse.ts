export interface BookingData {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: {
        checkin: string;
        checkout: string;
    };
}

export interface BookingResponse {
    bookingid: number;
    booking: BookingData;
}