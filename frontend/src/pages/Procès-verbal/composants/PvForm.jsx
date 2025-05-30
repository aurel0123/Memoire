import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin, Users, Plus, X, Save, Send } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import PropTypes from 'prop-types'

export function PvForm({ onDataChange, onSave, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    date: new Date(),
    time: '',
    room: '',
    juryMembers: [{ name: '', role: 'Président' }],
    summary: '',
    finalNote: 0,
    status: 'draft'
  });

  const steps = [
    { title: 'Informations générales', icon: Users },
    { title: 'Jury et évaluation', icon: Users },
    { title: 'Finalisation', icon: Send }
  ];

  const updateFormData = (updates) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataChange(newData);
  };

  const addJuryMember = () => {
    const newMembers = [...formData.juryMembers, { name: '', role: '' }];
    updateFormData({ juryMembers: newMembers });
  };

  const removeJuryMember = (index) => {
    const newMembers = formData.juryMembers.filter((_, i) => i !== index);
    updateFormData({ juryMembers: newMembers });
  };

  const updateJuryMember = (index, field, value) => {
    const newMembers = formData.juryMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    updateFormData({ juryMembers: newMembers });
  };

  const handleSave = () => {
    onSave();
    toast("PV sauvegardé",{
      description: "Le procès-verbal a été sauvegardé en brouillon.",
    });
  };

  const handleSubmit = () => {
    updateFormData({ status: 'submitted' });
    onSubmit();
    toast.success("PV soumis",{
      description: "Le procès-verbal a été soumis pour validation.",
    });
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Création du PV</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Étape {currentStep + 1} sur {steps.length}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${
                  index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nom de l&apos;étudiant</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => updateFormData({ studentName: e.target.value })}
                    placeholder="Nom complet de l'étudiant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet de soutenance</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => updateFormData({ subject: e.target.value })}
                    placeholder="Titre du projet ou mémoire"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date.toISOString().split('T')[0]}
                      onChange={(e) => updateFormData({ date: new Date(e.target.value) })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateFormData({ time: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Salle</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => updateFormData({ room: e.target.value })}
                      placeholder="Salle 101"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium">Membres du jury</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addJuryMember}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un membre
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.juryMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <Input
                          placeholder="Nom du membre"
                          value={member.name}
                          onChange={(e) => updateJuryMember(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Rôle (Président, Examinateur...)"
                          value={member.role}
                          onChange={(e) => updateJuryMember(index, 'role', e.target.value)}
                        />
                      </div>
                      {formData.juryMembers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeJuryMember(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Appréciation générale</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => updateFormData({ summary: e.target.value })}
                  placeholder="Résumé de la soutenance et appréciation du jury..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalNote">Note finale (/20)</Label>
                <Input
                  id="finalNote"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.finalNote}
                  onChange={(e) => updateFormData({ finalNote: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Récapitulatif</h3>
                <p className="text-gray-600">Vérifiez les informations avant la finalisation</p>
              </div>

              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div><strong>Étudiant:</strong> {formData.studentName}</div>
                <div><strong>Sujet:</strong> {formData.subject}</div>
                <div><strong>Date:</strong> {formData.date.toLocaleDateString('fr-FR')} à {formData.time}</div>
                <div><strong>Salle:</strong> {formData.room}</div>
                <div><strong>Note finale:</strong> {formData.finalNote}/20</div>
                <div>
                  <strong>Jury:</strong>
                  <ul className="mt-1 space-y-1">
                    {formData.juryMembers.map((member, index) => (
                      <li key={index} className="text-sm">
                        • {member.name} ({member.role})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Finaliser le PV
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

PvForm.propTypes = {
  onDataChange : PropTypes.func , 
  onSave : PropTypes.func , 
  onSubmit : PropTypes.func
}