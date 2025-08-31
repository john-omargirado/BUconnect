"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, Calendar, Loader2, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface Skill {
  id: string;
  title: string;
  description?: string;
  category: string;
  status?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    college?: string;
    department?: string;
    trustScore: number;
  };
}

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
}

export function SkillDetailModal({ skill, isOpen, onClose, onEdit, onDelete }: SkillDetailModalProps) {
  if (!skill) return null;

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
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Skill Details</h2>
                  <p className="text-blue-100 text-sm">View and manage skill information</p>
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
              {/* Skill Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h3 className="font-bold text-lg">{skill.title}</h3>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="primary">{skill.category}</Badge>
                  </div>
                </div>

                {skill.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                      <p className="text-sm leading-relaxed">{skill.description}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Created</label>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{new Date(skill.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Posted by</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{skill.user.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.user.email}</p>
                      {skill.user.college && (
                        <p className="text-sm text-muted-foreground">{skill.user.college}</p>
                      )}
                      {skill.user.department && (
                        <p className="text-sm text-muted-foreground">{skill.user.department}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">Trust Score:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{skill.user.trustScore}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-muted/20 flex gap-3">
              <Button
                onClick={() => onEdit(skill)}
                className="flex-1"
              >
                Edit Skill
              </Button>
              <Button
                onClick={() => onDelete(skill.id)}
                variant="danger"
                className="flex-1"
              >
                Delete Skill
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

interface SkillEditModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (skillData: any) => void;
  isLoading?: boolean;
}

export function SkillEditModal({ skill, isOpen, onClose, onSave, isLoading = false }: SkillEditModalProps) {
  const [formData, setFormData] = useState({
    title: skill?.title || "",
    description: skill?.description || "",
    category: skill?.category || "",
    status: skill?.status || "ACTIVE"
  });

  const categories = [
    "ACADEMICS",
    "TECH",
    "DESIGN",
    "WRITING",
    "LANGUAGE",
    "MUSIC",
    "ARTS",
    "BUSINESS",
    "MARKETING",
    "OTHER"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!skill) return null;

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
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Edit Skill</h2>
                  <p className="text-green-100 text-sm">Update skill information</p>
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
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                disabled={isLoading}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 bg-background text-foreground"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 bg-background text-foreground"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 bg-background text-foreground resize-none"
                  placeholder="Optional description..."
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
