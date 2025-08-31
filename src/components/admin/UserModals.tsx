"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Shield, Building, GraduationCap, Star, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college?: string;
  department?: string;
  year?: number;
  trustScore: number;
  createdAt: string;
  skills?: any[];
  requests?: any[];
  _count?: {
    skills: number;
    requests: number;
  };
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserDetailModal({ user, isOpen, onClose, onEdit, onDelete }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background dark:bg-gray-800 rounded-2xl shadow-2xl border border-border dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">User Details</h2>
                  <p className="text-blue-100 text-sm">View and manage user information</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Name</label>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Role</label>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.college && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">College</label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{user.college}</span>
                      </div>
                    </div>
                  )}

                  {user.department && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Department</label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{user.department}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Trust Score</label>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{user.trustScore}/5.0</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Member Since</label>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {user._count && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Activity Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user._count.skills}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Skills Offered</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{user._count.requests}</div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Help Requests</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Skills</h3>
                  <div className="space-y-3">
                    {user.skills.slice(0, 3).map((skill: any) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{skill.title}</div>
                          <div className="text-sm text-muted-foreground">{skill.category}</div>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Requests */}
              {user.requests && user.requests.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
                  <div className="space-y-3">
                    {user.requests.slice(0, 3).map((request: any) => (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-muted-foreground">{request.category}</div>
                        </div>
                        <Badge variant="warning">{request.status || "Open"}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-muted/20 flex gap-3">
              <Button
                onClick={() => onEdit(user)}
                className="flex-1"
              >
                Edit User
              </Button>
              <Button
                onClick={() => onDelete(user.id)}
                variant="danger"
                className="flex-1"
                disabled={user.role === "ADMIN"}
              >
                Delete User
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  isLoading?: boolean;
}

export function UserEditModal({ user, isOpen, onClose, onSave, isLoading = false }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "USER",
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year?.toString() || "",
    trustScore: user?.trustScore?.toString() || "0"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background dark:bg-gray-800 rounded-2xl shadow-2xl border border-border dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Edit User</h2>
                  <p className="text-green-100 text-sm">Update user information</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 bg-background text-foreground"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <Input
                  label="College"
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  label="Year Level"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  label="Trust Score"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.trustScore}
                  onChange={(e) => handleInputChange("trustScore", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </form>

            {/* Actions */}
            <div className="p-6 border-t bg-muted/20 flex gap-3">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
