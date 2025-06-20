from sqlalchemy.orm import Session
from sqlalchemy import func, case
from . import models, schemas
from typing import List, Optional
from datetime import datetime

# Event CRUD operations


def create_event(db: Session, event: schemas.EventCreate) -> models.Event:
    db_event = models.Event(
        title=event.title,
        description=event.description,
        creator_name=event.creator_name,
        creator_email=event.creator_email
    )
    db.add(db_event)
    db.flush()  # Get the event ID

    # Create time slots
    for slot_data in event.time_slots:
        db_slot = models.TimeSlot(
            event_id=db_event.id,
            start_time=slot_data.start_time,
            end_time=slot_data.end_time,
            max_bookings=slot_data.max_bookings
        )
        db.add(db_slot)

    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, skip: int = 0, limit: int = 100) -> List[models.Event]:
    return db.query(models.Event).offset(skip).limit(limit).all()


def get_event(db: Session, event_id: str) -> Optional[models.Event]:
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def get_event_with_slots(db: Session, event_id: str) -> Optional[models.Event]:
    return db.query(models.Event).filter(models.Event.id == event_id).first()

# Time Slot CRUD operations


def get_time_slots_for_event(db: Session, event_id: str) -> List[models.TimeSlot]:
    return db.query(models.TimeSlot).filter(models.TimeSlot.event_id == event_id).all()


def get_time_slot(db: Session, slot_id: str) -> Optional[models.TimeSlot]:
    return db.query(models.TimeSlot).filter(models.TimeSlot.id == slot_id).first()


def update_time_slot_availability(db: Session, slot_id: str, is_available: bool):
    slot = db.query(models.TimeSlot).filter(
        models.TimeSlot.id == slot_id).first()
    if slot:
        slot.is_available = is_available
        db.commit()
        db.refresh(slot)
    return slot

# Booking CRUD operations


def create_booking(db: Session, slot_id: str, booking: schemas.BookingCreate) -> models.Booking:
    # Check if slot is available
    slot = get_time_slot(db, slot_id)
    if not slot or not slot.is_available:
        raise ValueError("Time slot is not available")

    # Check if user already booked this slot
    existing_booking = db.query(models.Booking).filter(
        models.Booking.time_slot_id == slot_id,
        models.Booking.attendee_email == booking.attendee_email
    ).first()

    if existing_booking:
        raise ValueError("You have already booked this time slot")

    # Check if slot is full
    current_bookings = db.query(models.Booking).filter(
        models.Booking.time_slot_id == slot_id
    ).count()

    if current_bookings >= slot.max_bookings:
        raise ValueError("This time slot is full")

    # Create booking
    db_booking = models.Booking(
        time_slot_id=slot_id,
        attendee_name=booking.attendee_name,
        attendee_email=booking.attendee_email
    )
    db.add(db_booking)

    # Update slot availability if full
    if current_bookings + 1 >= slot.max_bookings:
        slot.is_available = False

    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_bookings_by_email(db: Session, email: str) -> List[models.Booking]:
    return db.query(models.Booking).filter(models.Booking.attendee_email == email).all()

# Utility functions for event listing


def get_events_with_slot_counts(db: Session, skip: int = 0, limit: int = 100):
    """Get events with total and available slot counts"""
    events = db.query(
        models.Event,
        func.count(models.TimeSlot.id).label('total_slots'),
        func.sum(case((models.TimeSlot.is_available == True, 1), else_=0)).label(
            'available_slots')
    ).outerjoin(models.TimeSlot).group_by(models.Event.id).offset(skip).limit(limit).all()

    return events
