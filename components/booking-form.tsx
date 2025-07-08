'use client';

import Script from 'next/script';

export function BookingForm() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Script src="https://booking.previo.app/iframe/" strategy="afterInteractive" />
      <iframe
        src="https://booking.previo.app/?hotId=782975"
        scrolling="no"
        frameBorder="0"
        width="100%"
        height="2000"
        name="previo-booking-iframe"
        id="previo-booking-iframe"
        className="rounded-xl shadow-lg bg-transparent"
      ></iframe>
    </div>
  );
}
