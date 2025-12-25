import React, { useState } from 'react';
import { useStore, Document } from '@/lib/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject, updateProject, deleteProject, getProject } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FolderOpen, Trash2, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Project } from '@shared/schema';

export function ProjectManager() {
  const doc = useStore((s) => s.doc);
  const currentProjectId = useStore((s) => s.currentProjectId);
  const currentProjectName = useStore((s) => s.currentProjectName);
  const setCurrentProject = useStore((s) => s.setCurrentProject);
  const loadDocument = useStore((s) => s.loadDocument);
  const resetToDefault = useStore((s) => s.resetToDefault);
  
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      const projectData = {
        name,
        document: doc as any,
      };
      
      if (currentProjectId) {
        return updateProject(currentProjectId, projectData);
      } else {
        return createProject(projectData);
      }
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCurrentProject(project.id, project.name);
      toast.success(currentProjectId ? 'Project updated' : 'Project saved');
      setIsSaveDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to save project');
    },
  });

  const loadMutation = useMutation({
    mutationFn: getProject,
    onSuccess: (project) => {
      if (project.document) {
        loadDocument(project.document as Document);
      }
      setCurrentProject(project.id, project.name);
      toast.success(`Loaded "${project.name}"`);
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to load project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  const handleSave = () => {
    if (currentProjectId) {
      saveMutation.mutate(currentProjectName);
    } else {
      setProjectName('');
      setIsSaveDialogOpen(true);
    }
  };

  const handleNewProject = () => {
    resetToDefault();
    setCurrentProject(null, 'Untitled Project');
    toast.success('New project created');
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 bg-white/5 border-white/10 hover:bg-white/10"
        onClick={handleSave}
        disabled={saveMutation.isPending}
        data-testid="button-save-project"
      >
        <Save className="w-3 h-3 mr-2" />
        {currentProjectId ? 'Update' : 'Save'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 bg-white/5 border-white/10 hover:bg-white/10" data-testid="button-open-projects">
            <FolderOpen className="w-3 h-3 mr-2" />
            Projects
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="font-display">Your Projects</DialogTitle>
            <DialogDescription>Load, manage, or create new musical arrangements</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-primary/30 hover:bg-primary/10"
              onClick={handleNewProject}
              data-testid="button-new-project"
            >
              <Plus className="w-4 h-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">New Project</div>
                <div className="text-xs text-muted-foreground">Start fresh with default template</div>
              </div>
            </Button>

            {projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No saved projects yet. Create your first arrangement!
              </div>
            )}

            {projects.map((project: Project) => (
              <div
                key={project.id}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-lg border transition-all hover:bg-white/5",
                  currentProjectId === project.id ? "border-primary/50 bg-primary/5" : "border-white/10"
                )}
                data-testid={`project-item-${project.id}`}
              >
                <button
                  onClick={() => loadMutation.mutate(project.id)}
                  className="flex-1 text-left"
                  disabled={loadMutation.isPending}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteMutation.mutate(project.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-project-${project.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="font-display">Save Project</DialogTitle>
            <DialogDescription>Give your musical arrangement a name</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-black/40 border-white/10"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && projectName.trim()) {
                  saveMutation.mutate(projectName);
                }
              }}
              data-testid="input-project-name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
              className="bg-white/5 border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate(projectName)}
              disabled={!projectName.trim() || saveMutation.isPending}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-confirm-save"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
