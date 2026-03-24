import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '../../services/api';

export function SubmitLaundry({ onSuccess }) {
    const [clothesCount, setClothesCount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/student/laundry', { number_of_clothes: parseInt(clothesCount) });
            toast.success('Laundry submitted successfully!');
            setClothesCount('');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit laundry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Clothes</CardTitle>
                <CardDescription>Enter the number of clothes you are submitting to the laundry.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="clothesCount">Number of Clothes</Label>
                        <Input 
                            id="clothesCount" 
                            type="number" 
                            min="1" 
                            max="50" 
                            required 
                            value={clothesCount}
                            onChange={(e) => setClothesCount(e.target.value)}
                            placeholder="e.g., 5"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Entry'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export function BookSlot({ machines }) {
    const [date, setDate] = useState(new Date());
    const [selectedMachine, setSelectedMachine] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const handleBook = () => {
        if (!selectedMachine || !selectedTime || !date) {
            toast.error("Please select machine, date, and time slot.");
            return;
        }
        // In a real app, this would hit a booking API
        toast.success(`Slot booked on Machine ${selectedMachine} for ${format(date, 'PPP')} at ${selectedTime}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Book a Machine</CardTitle>
                <CardDescription>Reserve a washing machine for a specific time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Machine</Label>
                    <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a machine" />
                        </SelectTrigger>
                        <SelectContent>
                            {machines.map(m => (
                                <SelectItem key={m.id} value={m.machine_number}>
                                    Machine {m.machine_number} ({m.status})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Select Date</Label>
                        <div className="border rounded-md p-2">
                           <Calendar
                               mode="single"
                               selected={date}
                               onSelect={setDate}
                               disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                           />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                         <Label>Select Time Slot</Label>
                         <div className="grid grid-cols-2 gap-2 mt-2">
                             {timeSlots.map(time => (
                                 <Button 
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className="w-full text-xs"
                                    onClick={() => setSelectedTime(time)}
                                 >
                                     {time}
                                 </Button>
                             ))}
                         </div>
                    </div>
                </div>

                <Button className="w-full mt-4" onClick={handleBook}>Confirm Booking</Button>
            </CardContent>
        </Card>
    );
}
