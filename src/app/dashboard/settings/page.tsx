
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, FileText, Users, Download, Trash2, UserPlus, Image as ImageIcon, Video, MessageSquare, File as FileIcon, Calendar as CalendarIcon, FilterX, Folder, Edit, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRooms, type Label as RoomLabel, type SharedData, type DataType } from "@/context/RoomContext";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const dataTypeIcons: Record<DataType, React.ElementType> = {
    Image: ImageIcon,
    Video: Video,
    File: FileIcon,
    Chat: MessageSquare,
};


export default function SettingsPage() {
  const { toast } = useToast();
  const { user, updateProfile, loading } = useAuth();
  const { 
    rooms: joinedRooms, 
    labels, updateLabel, deleteLabel,
    sharedData, deleteSharedItem, deleteAllSharedData
  } = useRooms();

  // Profile State
  const [name, setName] = useState(user?.displayName || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Data Management State
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Label Management State
  const [isLabelEditDialogOpen, setIsLabelEditDialogOpen] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<RoomLabel | null>(null);
  const [editedLabelName, setEditedLabelName] = useState("");


  useEffect(() => {
    if (user) {
        setName(user.displayName || "");
    }
  }, [user]);


  const filteredData = useMemo(() => {
    return sharedData.filter(item => {
        const date = new Date(item.date);
        const dateMatch = !dateRange || (
            (!dateRange.from || date >= dateRange.from) &&
            (!dateRange.to || date <= dateRange.to)
        );
        const roomMatch = roomFilter === 'all' || item.roomId === roomFilter;
        const typeMatch = typeFilter === 'all' || item.type === typeMatch;
        return dateMatch && roomMatch && typeMatch;
    });
  }, [sharedData, dateRange, roomFilter, typeFilter]);


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    try {
        await updateProfile({ displayName: name });
        toast({
          title: "Profile Saved",
          description: "Your profile information has been updated.",
        });
    } catch(err) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update profile."
        })
    } finally {
        setIsSavingProfile(false);
    }
  };

  const handleExport = () => {
    toast({
        title: "Exporting Data",
        description: "Your data export has started and will be emailed to you."
    });
  }

  const handleDeleteAllData = () => {
    deleteAllSharedData();
    toast({
        variant: "destructive",
        title: "Data Deletion",
        description: "All of your shared data has been deleted."
    });
  }

  const handleDeleteSingleItem = (itemId: string) => {
    deleteSharedItem(itemId);
    toast({
        title: "Item Deleted",
        description: "The selected item has been removed.",
    });
  }
  
  const handleDownloadItem = (itemName: string) => {
    toast({
        title: "Download Started",
        description: `"${itemName}" will begin downloading shortly.`,
    });
  }

  const resetFilters = () => {
    setDateRange(undefined);
    setRoomFilter("all");
    setTypeFilter("all");
  }

  const handleEditLabelClick = (label: RoomLabel) => {
    setLabelToEdit(label);
    setEditedLabelName(label.name);
    setIsLabelEditDialogOpen(true);
  }
  
  const handleSaveLabel = () => {
    if (labelToEdit && editedLabelName.trim()) {
      updateLabel(labelToEdit.id, editedLabelName.trim());
      setIsLabelEditDialogOpen(false);
      setLabelToEdit(null);
      setEditedLabelName("");
      toast({ title: "Label Updated" });
    }
  }

  const handleDeleteLabel = (labelId: string) => {
    deleteLabel(labelId);
    toast({ title: "Label Deleted" });
  }

  const DataIcon = ({type}: {type: DataType}) => {
    const Icon = dataTypeIcons[type];
    return <Icon className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, data, and connections.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <User /> Profile Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSavingProfile || loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    />
                </div>
                <Button type="submit" disabled={isSavingProfile || loading}>
                    {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                </form>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Users /> Manage Friends
                    </CardTitle>
                    <CardDescription>
                        Add, remove, or interact with your friends.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/friends" passHref>
                        <Button>
                            Go to Friends Page <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Folder /> Label Management
                    </CardTitle>
                    <CardDescription>
                    Edit or delete your custom room labels.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {labels.length > 0 ? (
                        labels.map(label => (
                        <div key={label.id} className="flex items-center gap-4 group">
                            <div className="flex-1">
                            <p className="font-medium">{label.name}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditLabelClick(label)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will delete the label &quot;{label.name}&quot; and unassign it from all rooms. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteLabel(label.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center pt-4">You haven't created any labels yet.</p>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText /> Data Management
            </CardTitle>
            <CardDescription>
                Review, export, or delete your data shared within rooms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <Label>Date range</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div>
                    <Label htmlFor="room-filter">Room</Label>
                    <Select value={roomFilter} onValueChange={setRoomFilter}>
                        <SelectTrigger id="room-filter">
                            <SelectValue placeholder="Filter by room..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Rooms</SelectItem>
                            {joinedRooms.map(room => (
                                <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="type-filter">Data Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger id="type-filter">
                            <SelectValue placeholder="Filter by type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Image">Image</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="File">File</SelectItem>
                            <SelectItem value="Chat">Chat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? filteredData.map(item => (
                             <TableRow key={item.id}>
                                <TableCell><DataIcon type={item.type} /></TableCell>
                                <TableCell className="font-medium truncate max-w-xs">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.room}</TableCell>
                                <TableCell className="text-muted-foreground">{format(item.date, "LLL dd, y")}</TableCell>
                                <TableCell className="text-muted-foreground">{item.size}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadItem(item.name)}>
                                            <Download className="h-4 w-4"/>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone and will permanently delete this item.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSingleItem(item.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No data found for the selected filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button variant="outline" onClick={resetFilters}>
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear Filters
                </Button>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={handleExport} disabled={filteredData.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export All
                    </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={filteredData.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all of your shared data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAllData}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isLabelEditDialogOpen} onOpenChange={setIsLabelEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Label</DialogTitle>
            <DialogDescription>
              Rename your label below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-label-name">Label Name</Label>
            <Input 
              id="edit-label-name" 
              value={editedLabelName} 
              onChange={e => setEditedLabelName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveLabel}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
