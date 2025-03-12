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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b bg-[#0c3b5a] text-white">
        <div className="flex h-14 items-center px-4">
          <Button variant="ghost" size="icon" className="mr-2 text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <div className="flex items-center">
            <span className="text-lg font-semibold">WasteHarmonics</span>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
            <div className="ml-2 text-right">
              <div className="text-xs">Partner Admin</div>
              <div className="text-xs">12:47 IST</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">IRWM - INDIA</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Accounts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Vadodara</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Filter Controls */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select defaultValue="irwm-india">
            <SelectTrigger>
              <SelectValue placeholder="IRWM - INDIA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="irwm-india">IRWM - INDIA</SelectItem>
              <SelectItem value="irwm-other">IRWM - OTHER</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="vadodara">
            <SelectTrigger>
              <SelectValue placeholder="Vadodara" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vadodara">Vadodara</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a Site..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site1">Site 1</SelectItem>
              <SelectItem value="site2">Site 2</SelectItem>
              <SelectItem value="site3">Site 3</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="device1">Device 1</SelectItem>
              <SelectItem value="device2">Device 2</SelectItem>
              <SelectItem value="device3">Device 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mb-4">
          <Button className="bg-[#0c3b5a] hover:bg-[#0a2e45]">Go</Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="mb-4">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger
              value="account"
              className="border-b-2 border-[#0c3b5a]"
            >
              Account
            </TabsTrigger>
            <TabsTrigger value="account-reports">Account Reports</TabsTrigger>
            <TabsTrigger value="account-contacts">Account Contacts</TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
            <TabsTrigger value="account-events">Account Events</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
          </TabsList>
        </Tabs>

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
              <h2 className="text-lg font-semibold">SmartBin UBi</h2>
            </div>
            <div className="flex items-center">
              <span className="bg-[#9c2760] text-white px-2 py-1 rounded-md mr-2">
                40
              </span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  Fill Level % <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Sensor <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Container <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Site <ChevronDown className="h-4 w-4 inline-block" />
                  </div>
                </TableHead>
                <TableHead>
                  Category <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Last Reported <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead>
                  Last Serviced <ChevronDown className="h-4 w-4 inline-block" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteData.map((item) => (
                <TableRow key={item.sensor}>
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
                  <TableCell>{item.container}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-green-500">
                    {item.lastReported}
                  </TableCell>
                  <TableCell className="text-green-500">
                    {item.lastServiced}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function getFillLevelColor(level: number): string {
  if (level > 35) return "bg-green-500";
  if (level > 25) return "bg-yellow-500";
  return "bg-red-500";
}

const wasteData = [
  {
    fillLevel: 37,
    sensor: "H-4962",
    container: "Kailash Party Plot",
    site: "Kailash Party Plot",
    category: "East",
    lastReported: "Thu 18/01/2024 09:30:06",
    lastServiced: "No date recorded",
  },
  {
    fillLevel: 35,
    sensor: "H-4963",
    container: "Atithi Grah",
    site: "Atithi Grah",
    category: "South",
    lastReported: "Thu 18/01/2024 09:30:07",
    lastServiced: "No date recorded",
  },
  {
    fillLevel: 33,
    sensor: "H-3372",
    container: "Nr. Fine Arts Gate",
    site: "Nr. Fine Arts Gate",
    category: "North",
    lastReported: "Thu 18/01/2024 09:30:06",
    lastServiced: "No date recorded",
  },
  {
    fillLevel: 22,
    sensor: "H-2980",
    container: "Ramveer Mandir",
    site: "Ramveer Mandir",
    category: "North",
    lastReported: "Thu 18/01/2024 09:30:06",
    lastServiced: "No date recorded",
  },
  {
    fillLevel: 20,
    sensor: "H-3358",
    container: "Swati Shak Market",
    site: "Swati Shak Market",
    category: "North",
    lastReported: "Thu 18/01/2024 09:30:06",
    lastServiced: "No date recorded",
  },
  {
    fillLevel: 17,
    sensor: "H-4064",
    container: "Manjalpur Shamshan",
    site: "Manjalpur Shamshan",
    category: "South",
    lastReported: "Thu 18/01/2024 09:30:06",
    lastServiced: "No date recorded",
  },
];
