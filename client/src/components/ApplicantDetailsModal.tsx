import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Clock, File } from 'lucide-react';
import type { Applicant } from '@/types';

interface ApplicantDetailsModalProps {
  applicant: Applicant;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicantDetailsModal({ applicant, isOpen, onClose }: ApplicantDetailsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Applicant Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the applicant
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {applicant.firstName} {applicant.lastName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="mr-2 h-4 w-4" />
                <span>{applicant.email}</span>
              </div>
              
              {applicant.phone && (
                <div className="flex items-center text-sm text-gray-400">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{applicant.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="mr-2 h-4 w-4" />
                <span>Applied: {formatDate(applicant.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          {/* Application Details */}
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Department ID</span>
              <div className="mt-1">
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                  {applicant.departmentId}
                </Badge>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Experience</span>
              <div className="mt-1 text-gray-300">
                {applicant.experience}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Skills</span>
              <div className="mt-1 text-gray-300">
                {applicant.skills}
              </div>
            </div>
            
            {applicant.coverLetter && (
              <div>
                <span className="text-sm text-gray-500">Cover Letter</span>
                <div className="mt-1 p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm">
                  {applicant.coverLetter}
                </div>
              </div>
            )}
            
            {applicant.resumePath && (
              <div>
                <span className="text-sm text-gray-500">Resume</span>
                <div className="mt-1">
                  <a
                    href={`/${applicant.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <File className="mr-2 h-4 w-4" />
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
