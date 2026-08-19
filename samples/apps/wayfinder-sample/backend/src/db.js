// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { flights as seedFlights, hotels as seedHotels, trips as seedTrips } from "./data.js";

const flights = structuredClone(seedFlights);
const hotels = structuredClone(seedHotels);
const trips = structuredClone(seedTrips);
const upgradeRequests = [];

let bookings = [];

function matches(value, term) {
  return String(value).toLowerCase().includes(String(term).toLowerCase());
}

function equalsIgnoreCase(value, other) {
  return String(value).toLowerCase() === String(other).toLowerCase();
}

function isBusiness(flight) {
  return equalsIgnoreCase(flight.cabin, "business");
}

export function findFlights({ from, to, cabin }) {
  return flights
    .filter((flight) => flight.available === 1)
    .filter((flight) => !from || matches(flight.from, from))
    .filter((flight) => !to || matches(flight.to, to))
    .filter((flight) => !cabin || matches(flight.cabin, cabin))
    .sort((left, right) => left.price - right.price);
}

export function findRecommendedFlights({ limit = 3 } = {}) {
  const available = flights.filter((flight) => flight.available === 1);

  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));

    [available[index], available[swapWith]] = [available[swapWith], available[index]];
  }

  return available.slice(0, limit);
}

export function findFlightById(id) {
  return flights.find((flight) => flight.id === id) || null;
}

export function findHotels({ location, maxNightlyRate }) {
  const hasRateLimit =
    maxNightlyRate !== undefined && maxNightlyRate !== null && !Number.isNaN(maxNightlyRate);

  return hotels
    .filter((hotel) => !location || matches(hotel.location, location))
    .filter((hotel) => !hasRateLimit || hotel.nightlyRate <= maxNightlyRate)
    .sort((left, right) => right.rating - left.rating);
}

export function listTrips({ destination } = {}) {
  return trips
    .filter((trip) => !destination || matches(trip.destination, destination))
    .sort((left, right) => left.totalEstimate - right.totalEstimate);
}

export function listLocations({ category } = {}) {
  let entries;

  if (category === "hotels") {
    entries = hotels.map((hotel) => ({ name: hotel.location, type: "area" }));
  } else if (category === "trips") {
    entries = trips.map((trip) => ({ name: trip.destination, type: "destination" }));
  } else {
    entries = flights.flatMap((flight) => [
      { name: flight.from, type: "city" },
      { name: flight.to, type: "city" }
    ]);
  }

  const unique = new Map();

  for (const entry of entries) {
    unique.set(`${entry.name}|${entry.type}`, entry);
  }

  return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function createBookingRecord({
  id,
  bookingReference,
  user,
  type,
  itemId,
  travelers,
  status,
  createdAt
}) {
  const booking = {
    id,
    bookingReference,
    userId: user.id,
    username: user.id,
    type,
    itemId,
    travelers,
    status,
    createdAt
  };

  bookings.push(booking);

  return { ...booking };
}

export function findDuplicateBooking({ username, type, itemId }) {
  if (type !== "flight") {
    const duplicate = bookings.find(
      (booking) =>
        booking.username === username && booking.type === type && booking.itemId === itemId
    );

    return duplicate ? { id: duplicate.id } : undefined;
  }

  const requestedFlight = findFlightById(itemId);

  if (!requestedFlight) {
    return undefined;
  }

  const duplicate = bookings.find((booking) => {
    if (booking.username !== username || booking.type !== "flight") {
      return false;
    }

    const bookedFlight = findFlightById(booking.itemId);

    return (
      bookedFlight &&
      bookedFlight.from === requestedFlight.from &&
      bookedFlight.to === requestedFlight.to &&
      bookedFlight.departureTime === requestedFlight.departureTime &&
      bookedFlight.arrivalTime === requestedFlight.arrivalTime &&
      bookedFlight.dates === requestedFlight.dates
    );
  });

  return duplicate ? { id: duplicate.id } : undefined;
}

function toFlightBooking(booking) {
  const flight = findFlightById(booking.itemId);

  if (!flight) {
    return null;
  }

  return {
    id: booking.id,
    bookingReference: booking.bookingReference,
    username: booking.username,
    travelers: booking.travelers,
    status: booking.status,
    createdAt: booking.createdAt,
    flight
  };
}

export function listBookedFlights(username) {
  return bookings
    .filter((booking) => booking.type === "flight" && booking.username === username)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(toFlightBooking)
    .filter(Boolean);
}

export function deleteBookingsForUser(username) {
  const remaining = bookings.filter((booking) => booking.username !== username);
  const deleted = bookings.length - remaining.length;

  bookings = remaining;

  return { deleted };
}

export function findBusinessFlightForRoute({ fromCity, toCity, airline }) {
  return (
    flights.find(
      (flight) =>
        isBusiness(flight) &&
        equalsIgnoreCase(flight.from, fromCity) &&
        equalsIgnoreCase(flight.to, toCity) &&
        equalsIgnoreCase(flight.airline, airline)
    ) || null
  );
}

export function findBusinessFlightsForRoute({ fromCity, toCity }) {
  return flights
    .filter(
      (flight) =>
        isBusiness(flight) &&
        flight.available === 1 &&
        equalsIgnoreCase(flight.from, fromCity) &&
        equalsIgnoreCase(flight.to, toCity)
    )
    .sort((left, right) => left.price - right.price);
}

export function findMatchingBusinessFlight(economyFlightId) {
  return findFlightById(`${economyFlightId}-biz`);
}

function setBusinessAvailability(available) {
  let updated = 0;

  for (const flight of flights) {
    if (isBusiness(flight)) {
      flight.available = available;
      updated += 1;
    }
  }

  return updated;
}

export function setAllBusinessFlightsAvailable() {
  return { updated: setBusinessAvailability(1) };
}

export function setAllBusinessFlightsUnavailable() {
  return { updated: setBusinessAvailability(0) };
}

export function getBookingById(bookingId) {
  const booking = bookings.find(
    (candidate) => candidate.id === bookingId && candidate.type === "flight"
  );

  return booking ? toFlightBooking(booking) : null;
}

export function createUpgradeRequest({
  id,
  userId,
  email,
  idToken,
  bookingId,
  fromFlightId,
  createdAt
}) {
  upgradeRequests.push({
    id,
    userId,
    username: email ?? null,
    bookingId,
    fromFlightId,
    idToken: idToken ?? null,
    status: "pending",
    createdAt,
    updatedAt: createdAt
  });

  return { id, userId, email, bookingId, fromFlightId, status: "pending", createdAt };
}

export function getOnePendingUpgrade() {
  const pending = upgradeRequests
    .filter((request) => request.status === "pending")
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

  if (pending.length === 0) {
    return { pendingCount: 0, request: null };
  }

  const [next] = pending;
  const fromFlight = findFlightById(next.fromFlightId);

  if (!fromFlight) {
    return { pendingCount: 0, request: null };
  }

  const bizFlight = findMatchingBusinessFlight(next.fromFlightId);

  return {
    pendingCount: pending.length,
    request: {
      id: next.id,
      userId: next.userId,
      email: next.username,
      idToken: next.idToken,
      bookingId: next.bookingId,
      fromFlightId: next.fromFlightId,
      toFlightId: bizFlight ? bizFlight.id : null,
      priceDifference: bizFlight ? Math.max(0, bizFlight.price - fromFlight.price) : 0,
      status: next.status,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      route: { from: fromFlight.from, to: fromFlight.to, airline: fromFlight.airline },
      fromCabin: fromFlight.cabin,
      toCabin: bizFlight ? bizFlight.cabin : null,
      toFlightAvailable: bizFlight ? bizFlight.available === 1 : false
    }
  };
}

export function updateUpgradeStatus({ id, status, updatedAt }) {
  const request = upgradeRequests.find((candidate) => candidate.id === id);

  if (!request) {
    return { updated: 0 };
  }

  request.status = status;
  request.updatedAt = updatedAt;

  return { updated: 1 };
}

export function getUpgradeRequestById(id) {
  const request = upgradeRequests.find((candidate) => candidate.id === id);

  if (!request) {
    return null;
  }

  return {
    id: request.id,
    userId: request.userId,
    username: request.username,
    bookingId: request.bookingId,
    fromFlightId: request.fromFlightId,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  };
}

export function updateBookingFlight({ bookingId, newFlightId }) {
  const booking = bookings.find(
    (candidate) => candidate.id === bookingId && candidate.type === "flight"
  );

  if (!booking) {
    return { updated: 0 };
  }

  booking.itemId = newFlightId;

  return { updated: 1 };
}
