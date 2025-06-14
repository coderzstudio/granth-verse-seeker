
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, FileText, Copyright, Link as LinkIcon, Flag } from 'lucide-react';

const Report = () => {
  const [formData, setFormData] = useState({
    reportType: '',
    bookId: '',
    description: '',
    reporterName: '',
    reporterEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { value: 'book_issue', label: 'Book Issue', icon: FileText },
    { value: 'copyright_complaint', label: 'Copyright Complaint', icon: Copyright },
    { value: 'inappropriate_content', label: 'Inappropriate Content', icon: AlertTriangle },
    { value: 'broken_link', label: 'Broken Link', icon: LinkIcon },
    { value: 'other', label: 'Other', icon: Flag }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reportType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        report_type: formData.reportType,
        description: formData.description,
        reporter_name: formData.reporterName || null,
        reporter_email: formData.reporterEmail || null,
        book_id: formData.bookId || null
      };

      const { error } = await supabase
        .from('reports')
        .insert([reportData]);

      if (error) {
        console.error('Error submitting report:', error);
        toast.error('Failed to submit report. Please try again.');
      } else {
        toast.success('Report submitted successfully. Thank you for your feedback!');
        // Reset form
        setFormData({
          reportType: '',
          bookId: '',
          description: '',
          reporterName: '',
          reporterEmail: ''
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
            <p className="text-gray-600">
              Help us improve Sanatani Gyan by reporting any issues or concerns you encounter.
            </p>
          </div>

          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Submit a Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type *</Label>
                  <Select value={formData.reportType} onValueChange={(value) => handleInputChange('reportType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Book ID (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="bookId">Book ID (Optional)</Label>
                  <Input
                    id="bookId"
                    type="text"
                    placeholder="Enter book ID if reporting about a specific book"
                    value={formData.bookId}
                    onChange={(e) => handleInputChange('bookId', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    You can find the book ID in the URL when viewing a book
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about the issue..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                {/* Reporter Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reporterName">Your Name (Optional)</Label>
                    <Input
                      id="reporterName"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporterEmail">Your Email (Optional)</Label>
                    <Input
                      id="reporterEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.reporterEmail}
                      onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  * Required fields. Your contact information is optional but helpful for follow-up if needed.
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens after you submit?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your report will be reviewed by our team within 24-48 hours</li>
                <li>• We'll investigate the issue and take appropriate action</li>
                <li>• If you provided contact information, we may reach out for clarification</li>
                <li>• Reports help us maintain the quality and integrity of our content</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Report;
