"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

type AccessLog = {
  user_id: string;
  dashboard_access: boolean;
  access_start_time: string | null;
  access_end_time: string | null;
  access_granted_by: string | null;
  access_granted_at: string | null;
  user_email?: string; // From join
};

export default function AccessControl() {
  const router = useRouter();
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    await fetchAccessLogs();
  };

  const fetchAccessLogs = async () => {
    try {
      // Fetch access logs with user emails
      const { data, error } = await supabase
        .from('auth_logs')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .eq('dashboard_access', true);

      if (error) throw error;

      const logsWithEmails = data.map(log => ({
        ...log,
        user_email: log.users?.email
      }));

      setAccessLogs(logsWithEmails);
    } catch (error) {
      console.error('Error fetching access logs:', error);
      toast.error('Failed to fetch access logs');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    try {
      if (!newUserEmail || !startDate || !endDate) {
        toast.error('Please fill in all fields');
        return;
      }

      // First get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUserEmail)
        .single();

      if (userError || !userData) {
        toast.error('User not found');
        return;
      }

      const response = await fetch('/api/admin/dashboard-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          grantAccess: true,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to grant access');
      }

      toast.success('Access granted successfully');
      setNewUserEmail('');
      await fetchAccessLogs();
    } catch (error) {
      console.error('Error granting access:', error);
      toast.error('Failed to grant access');
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/dashboard-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          grantAccess: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to revoke access');
      }

      toast.success('Access revoked successfully');
      await fetchAccessLogs();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('Failed to revoke access');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Access Control</h1>

      {/* Grant Access Form */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Grant New Access</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
            <div className="space-y-2">
              <Label>Access Period</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <Button onClick={handleGrantAccess} className="w-full">
            Grant Access
          </Button>
        </CardContent>
      </Card>

      {/* Access Logs Table */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Current Access List</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Granted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLogs.map((log) => (
                <TableRow key={log.user_id}>
                  <TableCell>{log.user_email}</TableCell>
                  <TableCell>{format(new Date(log.access_start_time!), 'PPP')}</TableCell>
                  <TableCell>{format(new Date(log.access_end_time!), 'PPP')}</TableCell>
                  <TableCell>{log.access_granted_by}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevokeAccess(log.user_id)}
                    >
                      Revoke Access
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 