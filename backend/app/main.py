from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

from . import crud, models, schemas
from .database import engine, get_db

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BookMySlot API",
    description="A scheduling application API for creating events and booking time slots",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to BookMySlot API", "version": "1.0.0"}


@app.options("/")
def options_root():
    return {"message": "OK"}


@app.post("/events", response_model=schemas.EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    """Create a new event with time slots"""
    try:
        db_event = crud.create_event(db=db, event=event)
        return db_event
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/events", response_model=List[schemas.EventListResponse])
def list_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all events with slot information"""
    events_with_counts = crud.get_events_with_slot_counts(
        db=db, skip=skip, limit=limit)

    result = []
    for event, total_slots, available_slots in events_with_counts:
        result.append(schemas.EventListResponse(
            id=event.id,
            title=event.title,
            description=event.description,
            creator_name=event.creator_name,
            created_at=event.created_at,
            total_slots=total_slots or 0,
            available_slots=available_slots or 0
        ))

    return result


@app.get("/events/{event_id}", response_model=schemas.EventDetailResponse)
def get_event(event_id: str, db: Session = Depends(get_db)):
    """Get event details with all time slots"""
    event = crud.get_event(db=db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    time_slots = crud.get_time_slots_for_event(db=db, event_id=event_id)

    # Calculate current bookings for each slot
    slot_responses = []
    for slot in time_slots:
        current_bookings = db.query(models.Booking).filter(
            models.Booking.time_slot_id == slot.id
        ).count()

        slot_responses.append(schemas.TimeSlotResponse(
            id=slot.id,
            start_time=slot.start_time,
            end_time=slot.end_time,
            max_bookings=slot.max_bookings,
            is_available=slot.is_available,
            current_bookings=current_bookings
        ))

    return schemas.EventDetailResponse(
        event=event,
        time_slots=slot_responses
    )


@app.post("/events/{event_id}/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    event_id: str,
    booking: schemas.BookingCreate,
    slot_id: str = Query(..., description="Time slot ID to book"),
    db: Session = Depends(get_db)
):
    """Book a time slot for an event"""
    # Verify event exists
    event = crud.get_event(db=db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Verify slot belongs to event
    slot = crud.get_time_slot(db=db, slot_id=slot_id)
    if not slot or slot.event_id != event_id:
        raise HTTPException(
            status_code=404, detail="Time slot not found for this event")

    try:
        db_booking = crud.create_booking(
            db=db, slot_id=slot_id, booking=booking)

        # Get updated slot info for response
        updated_slot = crud.get_time_slot(db=db, slot_id=slot_id)
        current_bookings = db.query(models.Booking).filter(
            models.Booking.time_slot_id == slot_id
        ).count()

        slot_response = schemas.TimeSlotResponse(
            id=updated_slot.id,
            start_time=updated_slot.start_time,
            end_time=updated_slot.end_time,
            max_bookings=updated_slot.max_bookings,
            is_available=updated_slot.is_available,
            current_bookings=current_bookings
        )

        return schemas.BookingResponse(
            id=db_booking.id,
            attendee_name=db_booking.attendee_name,
            attendee_email=db_booking.attendee_email,
            created_at=db_booking.created_at,
            time_slot=slot_response
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/users/{email}/bookings", response_model=List[schemas.BookingResponse])
def get_user_bookings(email: str, db: Session = Depends(get_db)):
    """Get all bookings for a user by email"""
    bookings = crud.get_bookings_by_email(db=db, email=email)

    result = []
    for booking in bookings:
        slot = booking.time_slot
        current_bookings = db.query(models.Booking).filter(
            models.Booking.time_slot_id == slot.id
        ).count()

        slot_response = schemas.TimeSlotResponse(
            id=slot.id,
            start_time=slot.start_time,
            end_time=slot.end_time,
            max_bookings=slot.max_bookings,
            is_available=slot.is_available,
            current_bookings=current_bookings
        )

        result.append(schemas.BookingResponse(
            id=booking.id,
            attendee_name=booking.attendee_name,
            attendee_email=booking.attendee_email,
            created_at=booking.created_at,
            time_slot=slot_response
        ))

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
