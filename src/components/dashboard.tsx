"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  ChevronDown,
  Edit,
  Menu,
  MoreHorizontal,
  Plus,
  Trash,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import {
  addBinAction,
  binUpdateAction,
  deleteBinAction,
  getAllBinOwners,
  getAllBins,
} from "@/lib/actions";
import { toast } from "sonner";

// Form validation schema
const binFormSchema = z.object({
  binOwner: z.string(),
  sensorId: z.string().min(2, {
    message: "Sensor ID must be at least 2 characters.",
  }),
  site: z.string().min(3, {
    message: "Site must be at least 3 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  fillLevel: z.coerce.number().min(0).max(100, {
    message: "Fill level must be between 0 and 100.",
  }),
  reportDate: z.date({
    required_error: "A date is required.",
  }),
  reportTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in HH:MM format",
  }),
});

export default function DashboardPage({
  role,
  userId,
  accountName,
}: {
  role: string;
  userId: string;
  accountName: string;
}) {
  const [wasteData, setWasteData] = useState<
    | {
        id: string;
        fillLevel: number;
        sensor: string;
        site: string;
        category: string;
        lastReported: string;
        binOwner: {
          id: string;
          name: string;
        };
      }[]
    | null
  >(null);

  useEffect(() => {
    async function getBins() {
      const res = await getAllBins(role, userId);
      setWasteData(res);
    }
    getBins();
  }, []);

  const [selectedBin, setSelectedBin] = useState<{
    id: String;
    binOwner: string;
    reportDate: string;
    reportTime: string;
    fillLevel: number;
    category: string;
    site: string;
    sensorId: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [binOwners, setBinOwners] = useState<
    { name: string; id: string }[] | null
  >([]);

  useEffect(() => {
    async function getBinOwners() {
      const data = await getAllBinOwners();
      console.log(data);

      if (data.success && data.binOwners) {
        setBinOwners(data.binOwners);
      } else {
        toast.error("Failed fetching the binOwenrs");
      }
    }
    getBinOwners();
  }, []);

  const addBinForm = useForm({
    resolver: zodResolver(binFormSchema),
    defaultValues: {
      binOwner: "",
      sensorId: "",
      site: "",
      category: "",
      fillLevel: 0,
      reportDate: new Date(),
      reportTime: format(new Date(), "HH:mm"),
    },
  });

  // Update bin form
  const updateBinForm = useForm({
    resolver: zodResolver(binFormSchema),
    defaultValues: {
      binOwner: "",
      sensorId: "",
      site: "",
      category: "",
      fillLevel: 0,
      reportDate: new Date(),
      reportTime: "00:00",
    },
  });

  // Format date and time to a string
  function formatDateTime(date: string, time: string) {
    const [hours, minutes] = time.split(":");
    const dateObj = new Date(date);
    dateObj.setHours(Number.parseInt(hours, 10));
    dateObj.setMinutes(Number.parseInt(minutes, 10));

    return format(dateObj, "EEE dd/MM/yyyy HH:mm:ss");
  }

  // Parse date string to date object and time string
  function parseDateTimeString(dateTimeString: string) {
    try {
      // Try to parse the date string in the format "EEE dd/MM/yyyy HH:mm:ss"
      const date = parse(dateTimeString, "EEE dd/MM/yyyy HH:mm:ss", new Date());
      const time = format(date, "HH:mm");
      return { date, time };
    } catch (error) {
      // If parsing fails, return current date and time
      return {
        date: new Date(),
        time: format(new Date(), "HH:mm"),
      };
    }
  }

  async function onAddBinSubmit(values: {
    binOwner: string;
    reportDate: string;
    reportTime: string;
    fillLevel: number;
    category: string;
    site: string;
    sensorId: string;
  }) {
    // Generate a new ID

    const res = await addBinAction(values);
    if (res.success) {
      setWasteData((prev) => {
        return [...prev, res.bin];
      });
      toast.success("Bin Added succesfully");
    } else {
      toast.error("Error adding bin");
    }
    setIsAddDialogOpen(false);
    addBinForm.reset();
  }

  // Handle update bin submission
  async function onUpdateBinSubmit(values: {
    binOwner: string;
    reportDate: string;
    reportTime: string;
    fillLevel: number;
    category: string;
    site: string;
    sensorId: string;
  }) {
    if (!selectedBin) return;

    // Format date and time
    const lastReported = formatDateTime(values.reportDate, values.reportTime);

    // Update the bin data
    const res = await binUpdateAction({
      ...values,
      lastReported,
      id: selectedBin.id,
    });

    if (res.success && res.bin?.id) {
      const updatedData = wasteData?.map((bin) =>
        bin.id === selectedBin?.id
          ? {
              ...bin,
              sensor: values.sensorId,
              site: values.site,
              category: values.category,
              fillLevel: values.fillLevel,
              lastReported: lastReported,
            }
          : bin
      );
      if (updatedData) {
        setWasteData(updatedData);
        setIsUpdateDialogOpen(false);
        updateBinForm.reset();
      }
      toast.success("Bin updated successfully");
    } else {
      toast.error("Failed updating bin data");
    }
  }
  // Handle delete bin
  async function onDeleteBin() {
    if (!selectedBin) return;

    const res = await deleteBinAction(selectedBin.id);
    if (res.success) {
      const filteredData = wasteData?.filter(
        (bin) => bin.id !== selectedBin.id
      );
      if (filteredData) {
        setWasteData(filteredData);
      }
      toast.success("Bin deleted successfully");
    } else {
      toast.error("Error deleting bin");
    }
    setIsDeleteDialogOpen(false);
  }

  function handleUpdateClick(bin: any) {
    console.log("bin", bin);

    setSelectedBin({ ...bin });

    // Parse the date and time from the lastReported string
    const { date, time } = parseDateTimeString(bin.lastReported);

    updateBinForm.reset({
      binOwner: bin.binOwnerId,
      sensorId: bin.sensor,
      site: bin.site,
      category: bin.category,
      fillLevel: bin.fillLevel,
      reportDate: date,
      reportTime: time,
    });

    setIsUpdateDialogOpen(true);
  }

  // Open delete dialog
  function handleDeleteClick(bin: any) {
    setSelectedBin(bin);
    setIsDeleteDialogOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">ANS - INDIA</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Accounts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{accountName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* SmartBin Section */}
        <Card className="mb-4 border-l-8 border-l-[#9c2760]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 text-[#9c2760]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z" />
                  <path d="M10 10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">SmartBin</h2>
            </div>

            <div className="flex items-center">
              {role == "ADMIN" && (
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#0c3b5a] hover:bg-[#0a2e45]">
                      <Plus className="mr-2 h-4 w-4" /> Add bin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Bin</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new bin. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addBinForm}>
                      <form
                        onSubmit={addBinForm.handleSubmit(onAddBinSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={addBinForm.control}
                          name="binOwner"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bin Owner</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl className="w-full">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a BinOwner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {binOwners?.map((item) => {
                                    return (
                                      <SelectItem value={item.id} key={item.id}>
                                        {item.name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        ></FormField>
                        <FormField
                          control={addBinForm.control}
                          name="sensorId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sensor ID</FormLabel>
                              <FormControl>
                                <Input placeholder="H-XXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBinForm.control}
                          name="site"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site</FormLabel>
                              <FormControl>
                                <Input placeholder="Site location" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBinForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl className="w-full">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="North">North</SelectItem>
                                  <SelectItem value="South">South</SelectItem>
                                  <SelectItem value="East">East</SelectItem>
                                  <SelectItem value="West">West</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBinForm.control}
                          name="fillLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fill Level (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a value between 0 and 100
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={addBinForm.control}
                            name="reportDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Report Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addBinForm.control}
                            name="reportTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Report Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  Fill Level % <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Sensor <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Site <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Category <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Last Reported <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                {role == "ADMIN" && (
                  <TableHead className="h-4 w-4 inline-block">
                    Bin Owner
                  </TableHead>
                )}
                {role == "ADMIN" && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 h-6 bg-gray-200 rounded-sm overflow-hidden">
                        <div
                          className={`h-full ${getFillLevelColor(
                            item.fillLevel
                          )}`}
                          style={{ width: `${item.fillLevel}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{item.fillLevel} %</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.sensor}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-green-500">
                    {item.lastReported}
                  </TableCell>
                  {role == "ADMIN" && (
                    <TableCell>{item?.binOwner?.name}</TableCell>
                  )}

                  {role == "ADMIN" && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleUpdateClick(item)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Update Bin Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Bin</DialogTitle>
              <DialogDescription>
                Update the bin details. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...updateBinForm}>
              <form
                onSubmit={updateBinForm.handleSubmit(onUpdateBinSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={updateBinForm.control}
                  name="binOwner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bin Owner</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select a BinOwner"
                              defaultValue={selectedBin?.binOwner}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {binOwners?.map((item) => {
                            return (
                              <SelectItem value={item.id} key={item.id}>
                                {item.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={updateBinForm.control}
                  name="sensorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensor ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateBinForm.control}
                  name="site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateBinForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateBinForm.control}
                  name="fillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fill Level (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a value between 0 and 100
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={updateBinForm.control}
                    name="reportDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Report Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={updateBinForm.control}
                    name="reportTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Bin Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                bin
                {selectedBin && ` "${selectedBin.container}"`} and remove its
                data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteBin}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}

function getFillLevelColor(level: number): string {
  if (level > 50) return "bg-red-500";
  if (level > 25) return "bg-yellow-500";
  return "bg-green-500";
}
