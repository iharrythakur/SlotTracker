from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import datetime

# Event Schemas


class TimeSlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime
    max_bookings: int = 1

    @validator('end_time')
    def end_time_must_be_after_start_time(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be after start_time')
        return v


class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    creator_name: str
    creator_email: EmailStr
    time_slots: List[TimeSlotCreate]


class EventResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    creator_name: str
    creator_email: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    creator_name: str
    created_at: datetime
    total_slots: int
    available_slots: int

    class Config:
        from_attributes = True

# Time Slot Schemas


class TimeSlotResponse(BaseModel):
    id: str
    start_time: datetime
    end_time: datetime
    max_bookings: int
    is_available: bool
    current_bookings: int

    class Config:
        from_attributes = True

# Booking Schemas


class BookingCreate(BaseModel):
    attendee_name: str
    attendee_email: EmailStr


class BookingResponse(BaseModel):
    id: str
    attendee_name: str
    attendee_email: str
    created_at: datetime
    time_slot: TimeSlotResponse

    class Config:
        from_attributes = True

# Event Detail Response


class EventDetailResponse(BaseModel):
    event: EventResponse
    time_slots: List[TimeSlotResponse]
