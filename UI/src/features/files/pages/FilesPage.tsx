import * as React from "react";
import {
  Folder,
  File,
  Image as ImageIcon,
  FileText,
  Trash2,
  Lock,
  Search,
  Upload,
  Plus,
  ChevronRight,
  Shield,
  FolderPlus,
  ArrowLeft,
  X,
  FileCode,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilePermissions {
  admin: boolean;
  manager: boolean;
  employee: boolean;
  doctor: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  uploadDate: string;
  type: "jpg" | "png" | "pdf" | "folder";
  size: string;
  permissions: FilePermissions;
  parentId: string | null;
  visibility?: "public" | "private" | "custom";
}

// Initial mock data mirroring the user's snapshot
const INITIAL_MOCK_FILES: FileItem[] = [
  { id: "f-01", name: "1680088561Teqmed_License.jpg", originalName: "1680088561Te...", uploadDate: "16 Apr 2024 06:17 PM", type: "jpg", size: "2.4 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-02", name: "1680088571Pharma_Registration.jpg", originalName: "1680088571PH...", uploadDate: "16 Apr 2024 06:17 PM", type: "jpg", size: "1.8 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-03", name: "1680088576GST_Certificate.jpg", originalName: "1680088576GP...", uploadDate: "16 Apr 2024 06:17 PM", type: "jpg", size: "3.1 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-04", name: "1680088581PAN_Card.jpg", originalName: "1680088581PA...", uploadDate: "16 Apr 2024 06:17 PM", type: "jpg", size: "1.1 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-05", name: "1680088586Drug_License_20C.jpg", originalName: "1680088586LZ...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "2.5 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-06", name: "1680088596Drug_License_21B.jpg", originalName: "1680088596Cl...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "2.7 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-07", name: "1680088606Signature_Specimen.jpg", originalName: "1680088606Ha...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "900 KB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-08", name: "1680088616Electricity_Bill.jpg", originalName: "1680088616Ne...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "1.3 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-09", name: "1680088625Rent_Agreement.jpg", originalName: "1680088625LS...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "4.2 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-10", name: "1680088722Cancelled_Cheque.jpg", originalName: "1680088722Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "1.5 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-11", name: "1680088732Board_Resolution.jpg", originalName: "1680088732Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "2.2 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-12", name: "1680088742Partnership_Deed.jpg", originalName: "1680088742Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "3.5 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-13", name: "1680088751MOA_Document.jpg", originalName: "1680088751Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "5.1 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-14", name: "1680088761AOA_Document.jpg", originalName: "1680088761Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "4.8 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-15", name: "1682598433Wholesaler_List.jpg", originalName: "1682598433Wh...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "1.7 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-16", name: "1683782860Teqmed_Tax_Return.jpg", originalName: "1683782860Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "3.3 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-17", name: "1683782880Audited_Balance_Sheet.jpg", originalName: "1683782880Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "6.2 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-18", name: "1692159269Teqmed_Audit_Report.jpg", originalName: "1692159269Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "4.5 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-19", name: "1692159277visit_report_durg.jpg", originalName: "1692159277vi...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "1.2 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-20", name: "1692159285Teqmed_Stock_Statement.jpg", originalName: "1692159285Te...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "2.9 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-21", name: "1698909255Wholesaler_Agreement.jpg", originalName: "1698909255Wh...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "3.4 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-22", name: "1698909259Wholesaler_NOC.jpg", originalName: "1698909259Wh...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "1.6 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-23", name: "1700218027Wholesaler_Invoice.jpg", originalName: "1700218027Wh...", uploadDate: "16 Apr 2024 06:18 PM", type: "jpg", size: "2.8 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-24", name: "HS_6_01.jpg", originalName: "HS_6_01.jpg", uploadDate: "10 Aug 2024 02:32 AM", type: "jpg", size: "1.1 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-25", name: "HS_6_02.jpg", originalName: "HS_6_02.jpg", uploadDate: "10 Aug 2024 02:32 AM", type: "jpg", size: "1.2 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
  { id: "f-26", name: "HS_6_03.jpg", originalName: "HS_6_03.jpg", uploadDate: "10 Aug 2024 02:32 AM", type: "jpg", size: "1.0 MB", permissions: { admin: true, manager: true, employee: true, doctor: false }, parentId: null },
];

const STORAGE_KEY = "sefmed_filesystem_files";

export function FilesPage() {
  // Navigation State
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);

  // Live files list state loaded from localStorage
  const [files, setFiles] = React.useState<FileItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_MOCK_FILES;
  });

  // Search and Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");

  // Create Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");

  // Upload File Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // Permissions Modal State
  const [selectedPermissionFile, setSelectedPermissionFile] = React.useState<FileItem | null>(null);
  const [visibility, setVisibility] = React.useState<"public" | "private" | "custom">("public");
  const [permissionsMap, setPermissionsMap] = React.useState<FilePermissions>({
    admin: true,
    manager: true,
    employee: true,
    doctor: false,
  });

  // Delete Confirmation State
  const [deleteTargetFile, setDeleteTargetFile] = React.useState<FileItem | null>(null);

  // Persist files
  const saveFiles = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
  };

  // Folder helper: get path of active folders
  const getBreadcrumbs = React.useMemo(() => {
    const breadcrumbs: { id: string | null; name: string }[] = [{ id: null, name: "Root" }];
    let currentId = currentFolderId;
    const path: { id: string; name: string }[] = [];

    while (currentId) {
      const folder = files.find(f => f.id === currentId && f.type === "folder");
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return [...breadcrumbs, ...path];
  }, [files, currentFolderId]);

  // Handle Double-click or open folder
  const handleOpenFolder = (folder: FileItem) => {
    if (folder.type === "folder") {
      setCurrentFolderId(folder.id);
      setSearchTerm("");
    }
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a valid folder name");
      return;
    }
    const newFolder: FileItem = {
      id: `folder-${Math.random().toString(36).substring(2, 9)}`,
      name: newFolderName.trim(),
      originalName: newFolderName.trim(),
      uploadDate: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      type: "folder",
      size: "0 KB",
      permissions: { admin: true, manager: true, employee: true, doctor: false },
      parentId: currentFolderId,
    };

    saveFiles([...files, newFolder]);
    setNewFolderName("");
    setIsFolderModalOpen(false);
    toast.success(`Folder "${newFolder.name}" created successfully`);
  };

  // Handle simulated file upload
  const handleUploadFile = () => {
    if (!selectedFile) {
      toast.error("Please choose a file to upload");
      return;
    }
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate progress ticks
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const matchedType: any = ["jpg", "png", "pdf"].includes(fileExt) ? fileExt : "jpg";
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);

      const newFile: FileItem = {
        id: `file-${Math.random().toString(36).substring(2, 9)}`,
        name: selectedFile.name,
        originalName: selectedFile.name.length > 14 ? selectedFile.name.substring(0, 12) + "..." : selectedFile.name,
        uploadDate: new Date().toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        type: matchedType,
        size: `${sizeMB} MB`,
        permissions: { admin: true, manager: true, employee: true, doctor: false },
        parentId: currentFolderId,
      };

      saveFiles([...files, newFile]);
      setIsUploading(false);
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      toast.success(`File "${newFile.name}" uploaded successfully`);
    }, 1000);
  };

  // Trigger permission configurations
  const handleOpenPermissions = (file: FileItem) => {
    setSelectedPermissionFile(file);
    const vis = file.visibility || (
      (file.permissions.admin && file.permissions.manager && file.permissions.employee && file.permissions.doctor)
        ? "public"
        : (file.permissions.admin && !file.permissions.manager && !file.permissions.employee && !file.permissions.doctor)
        ? "private"
        : "custom"
    );
    setVisibility(vis);
    setPermissionsMap({ ...file.permissions });
  };

  const handleSavePermissions = () => {
    if (!selectedPermissionFile) return;
    
    let finalPermissions = { ...permissionsMap };
    if (visibility === "public") {
      finalPermissions = { admin: true, manager: true, employee: true, doctor: true };
    } else if (visibility === "private") {
      finalPermissions = { admin: true, manager: false, employee: false, doctor: false };
    }

    const updated = files.map((f) => {
      if (f.id === selectedPermissionFile.id) {
        return { 
          ...f, 
          visibility, 
          permissions: finalPermissions 
        };
      }
      return f;
    });
    saveFiles(updated);
    toast.success(`Permissions updated for ${selectedPermissionFile.name}`);
    setSelectedPermissionFile(null);
  };

  // File Deletion
  const handleDeleteConfirm = () => {
    if (!deleteTargetFile) return;
    
    // If it's a folder, recursively delete children too!
    const idsToDelete = new Set<string>([deleteTargetFile.id]);
    if (deleteTargetFile.type === "folder") {
      const collectChildren = (parentId: string) => {
        files.forEach((f) => {
          if (f.parentId === parentId) {
            idsToDelete.add(f.id);
            if (f.type === "folder") collectChildren(f.id);
          }
        });
      };
      collectChildren(deleteTargetFile.id);
    }

    const remaining = files.filter((f) => !idsToDelete.has(f.id));
    saveFiles(remaining);
    toast.success(`${deleteTargetFile.type === "folder" ? "Folder and its contents" : "File"} deleted successfully`);
    setDeleteTargetFile(null);
  };

  // Filtered Files to show in Grid
  const visibleFiles = React.useMemo(() => {
    return files.filter((f) => {
      // 1. Parent folder alignment
      if (f.parentId !== currentFolderId) return false;
      
      // 2. Search query filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return f.name.toLowerCase().includes(query);
      }

      // 3. File type selector filter
      if (filterType !== "all") {
        if (filterType === "folder" && f.type !== "folder") return false;
        if (filterType === "image" && !["jpg", "png"].includes(f.type)) return false;
        if (filterType === "pdf" && f.type !== "pdf") return false;
      }

      return true;
    });
  }, [files, currentFolderId, searchTerm, filterType]);

  // Truncation helper (keeps display names clean)
  const getDisplayName = (file: FileItem) => {
    if (file.type === "folder") {
      return file.name.length > 18 ? file.name.substring(0, 15) + "..." : file.name;
    }
    // Match the exact name representation style from user's snapshot
    if (file.name.length > 14) {
      return file.name.substring(0, 12) + "...";
    }
    return file.name;
  };

  return (
    <div className="flex flex-col space-y-5 p-6 animate-fade-in">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Folder className="h-6 w-6 text-[#008272]" />
            Files
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Access secure digital attachments, drug licenses, and client profiles folders.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsFolderModalOpen(true)}
            variant="outline"
            className="h-9 text-slate-700 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-1.5 active:scale-95 transition-transform"
          >
            <FolderPlus className="h-4 w-4 text-[#008272]" /> Create Folder
          </Button>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <Upload className="h-4 w-4" /> Upload File
          </Button>
        </div>
      </div>

      {/* Toolbar: Breadcrumbs, Search, Type Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 border rounded-xl shadow-sm border-slate-100">
        
        {/* Clickable Path Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 w-full md:w-auto">
          {getBreadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
              <button
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`hover:text-[#008272] transition-colors ${
                  idx === getBreadcrumbs.length - 1 ? "text-slate-800 font-bold" : ""
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search current folder..."
              className="pl-8 h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#008272]"
            />
          </div>

          <UiSelect value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-28 h-9 text-xs bg-white border-slate-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="folder">Folders</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="pdf">PDF Docs</SelectItem>
            </SelectContent>
          </UiSelect>
        </div>
      </div>

      {/* Main Files Display Grid Container */}
      <div className="bg-white border rounded-xl shadow-sm border-slate-100 overflow-hidden min-h-[450px] flex flex-col">
        {/* Current Folder Context Banner */}
        <div className="flex items-center justify-between p-3 border-b bg-slate-50/50 text-xs text-slate-500 font-semibold px-5">
          <span>
            {currentFolderId && (
              <button
                onClick={() => {
                  const parent = files.find(f => f.id === currentFolderId);
                  setCurrentFolderId(parent ? parent.parentId : null);
                }}
                className="mr-2 text-[#008272] hover:text-[#006e60] flex items-center gap-0.5 inline-flex align-middle"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            Contents of current folder
          </span>
          <span>{visibleFiles.length} items found</span>
        </div>

        {/* Files Grid */}
        <div className="p-5 flex-1">
          {visibleFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-50 border flex items-center justify-center">
                <Info className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Folder is Empty</p>
                <p className="text-xs">Drag/Upload files or create folders to populate.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleFiles.map((file) => {
                const isDir = file.type === "folder";
                
                return (
                  <Card
                    key={file.id}
                    onDoubleClick={() => isDir && handleOpenFolder(file)}
                    className={`border border-slate-100 hover:border-slate-200/80 shadow-none hover:shadow-md transition-all group overflow-hidden relative ${
                      isDir ? "cursor-pointer bg-slate-50/30 hover:bg-slate-50" : ""
                    }`}
                  >
                    <CardContent className="p-3.5 flex gap-3.5 items-center">
                      
                      {/* Left: Beautiful Custom Icon matching user's snapshot */}
                      {isDir ? (
                        <div className="h-14 w-12 bg-amber-50 border border-amber-200/60 rounded-lg flex items-center justify-center text-amber-500 shadow-sm relative group-hover:scale-105 transition-transform shrink-0">
                          <Folder className="h-7 w-7 fill-amber-400/20" />
                        </div>
                      ) : (
                        /* Image file container exactly as screenshot: gray square w/ picture placeholder + red tag bottom-left */
                        <div className="h-16 w-12 bg-slate-50 border border-slate-200/70 rounded-md flex items-center justify-center text-slate-400 shadow-sm relative group-hover:scale-105 transition-transform shrink-0">
                          {file.type === "pdf" ? (
                            <>
                              <FileText className="h-6 w-6 text-[#008272]" />
                              <span className="absolute bottom-1 left-1 bg-[#008272] text-white font-extrabold text-[7px] px-1 rounded uppercase">
                                PDF
                              </span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-6 w-6 text-slate-400/80" />
                              <span className="absolute bottom-1 left-1 bg-rose-500 text-white font-extrabold text-[7.5px] px-1 rounded uppercase tracking-wider">
                                {file.type}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Right: Filename, upload date, actions */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className="font-bold text-slate-800 text-xs truncate cursor-default block max-w-[130px]"
                            title={file.name}
                          >
                            {getDisplayName(file)}
                          </span>
                          {!isDir && (
                            <span className="text-[9px] font-semibold text-slate-400 select-none">
                              {file.size}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 font-semibold select-none">
                          {file.uploadDate}
                        </p>

                        {/* Actions Links matches user snapshot exact spacing/naming */}
                        <div className="flex items-center gap-3 pt-0.5 border-t border-slate-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetFile(file);
                            }}
                            className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer font-bold transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPermissions(file);
                            }}
                            className="text-[10px] text-slate-500 hover:text-sky-600 flex items-center gap-0.5 cursor-pointer font-bold transition-colors"
                          >
                            <Shield className="h-3 w-3" /> Permissions
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Create Folder */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize related attachments by creating a workspace folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <span className="text-xs font-bold text-slate-500">Folder Name</span>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Invoices, Certificates"
              className="focus-visible:ring-[#008272]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFolderModalOpen(false)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              className="bg-[#008272] hover:bg-[#006e60] text-white text-xs h-9"
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Upload File */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
            <DialogDescription>
              Upload documents (JPG, PNG, PDF) into the current workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Upload className="h-5 w-5" />
            </div>
            
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            
            <label
              htmlFor="file-upload-input"
              className="text-xs font-bold text-[#008272] hover:underline cursor-pointer"
            >
              {selectedFile ? selectedFile.name : "Click to select a file"}
            </label>
            
            <p className="text-[10px] text-slate-400">
              Max size 10MB (JPG, PNG, PDF formats allowed)
            </p>
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-full bg-[#008272] rounded-full transition-all duration-300"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                setSelectedFile(null);
                setIsUploadModalOpen(false);
              }}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadFile}
              disabled={isUploading || !selectedFile}
              className="bg-[#008272] hover:bg-[#006e60] text-white text-xs h-9"
            >
              Start Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Configure Permissions */}
      <Dialog
        open={selectedPermissionFile !== null}
        onOpenChange={(open) => !open && setSelectedPermissionFile(null)}
      >
        <DialogContent className="p-0 max-w-xl rounded-lg overflow-hidden border border-slate-200 bg-white">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-2xl font-light text-slate-800 tracking-tight">Permissions</h3>
          </div>

          {/* Body */}
          <div className="py-10 px-16 flex flex-col justify-center bg-white">
            <div className="flex flex-col gap-6 mx-auto w-full max-w-[280px]">
              <label 
                className="flex items-center gap-3.5 cursor-pointer select-none text-[15px] font-normal text-slate-700 hover:text-slate-900 transition-colors"
                onClick={() => setVisibility("public")}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${visibility === "public" ? 'border-slate-400 bg-white' : 'border-slate-300 bg-white'}`}>
                  {visibility === "public" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  )}
                </span>
                <span>Public ( Visible to all )</span>
              </label>

              <label 
                className="flex items-center gap-3.5 cursor-pointer select-none text-[15px] font-normal text-slate-700 hover:text-slate-900 transition-colors"
                onClick={() => setVisibility("private")}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${visibility === "private" ? 'border-slate-400 bg-white' : 'border-slate-300 bg-white'}`}>
                  {visibility === "private" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  )}
                </span>
                <span>Private ( Visible to me )</span>
              </label>

              <label 
                className="flex items-center gap-3.5 cursor-pointer select-none text-[15px] font-normal text-slate-700 hover:text-slate-900 transition-colors"
                onClick={() => setVisibility("custom")}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${visibility === "custom" ? 'border-slate-400 bg-white' : 'border-slate-300 bg-white'}`}>
                  {visibility === "custom" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  )}
                </span>
                <span>Custom ( Let me select )</span>
              </label>
            </div>

            {/* Custom permissions accordion sub-section */}
            {visibility === "custom" && (
              <div className="mt-6 p-4 border border-slate-100 rounded-lg bg-slate-50/55 space-y-3 animate-fade-in max-w-[340px] mx-auto w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b pb-1.5 border-slate-200/60">
                  Select allowed user roles
                </span>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Administrator</span>
                    <Checkbox
                      checked={permissionsMap.admin}
                      onCheckedChange={(checked) => setPermissionsMap({ ...permissionsMap, admin: !!checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Managers (Zone/Div)</span>
                    <Checkbox
                      checked={permissionsMap.manager}
                      onCheckedChange={(checked) => setPermissionsMap({ ...permissionsMap, manager: !!checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Representative (MR)</span>
                    <Checkbox
                      checked={permissionsMap.employee}
                      onCheckedChange={(checked) => setPermissionsMap({ ...permissionsMap, employee: !!checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Doctors / Chemists</span>
                    <Checkbox
                      checked={permissionsMap.doctor}
                      onCheckedChange={(checked) => setPermissionsMap({ ...permissionsMap, doctor: !!checked })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f8f9fa] border-t border-slate-100 flex justify-end gap-3.5">
            <button
              onClick={() => setSelectedPermissionFile(null)}
              className="px-5 py-2 text-sm font-normal text-slate-700 bg-[#e0e0e0] hover:bg-[#d5d5d5] rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSavePermissions}
              className="px-5 py-2 text-sm font-normal text-white bg-[#008272] hover:bg-[#006e60] rounded-md transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Delete Confirmation */}
      <Dialog
        open={deleteTargetFile !== null}
        onOpenChange={(open) => !open && setDeleteTargetFile(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-1.5">
              <Trash2 className="h-5 w-5" /> Delete File?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteTargetFile?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs text-slate-500">
            {deleteTargetFile?.type === "folder" ? (
              <p className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-rose-600 font-medium leading-relaxed">
                Warning: Deleting this folder will recursively delete all containing files and subfolders. This action cannot be undone.
              </p>
            ) : (
              <p>This will permanently delete this document from the Sefmed database storage.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTargetFile(null)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>
    </div>
  );
}
