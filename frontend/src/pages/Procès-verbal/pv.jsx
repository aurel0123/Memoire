import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

const PvSoutenance = () => {
  const [pvForm, setPvForm] = useState({
    session: 'Juin 2025',
    specialite: '',
    diplome: '',
    jury: '',
    salle: '',
    date: '',
    heure: '',
    matricule: '',
    nom: '',
    prenoms: '',
    dateNaiss: '',
    lieuNaiss: '',
    theme: '',
    examinateur: '',
    gradeExaminateur: '',
    rapporteur: '',
    gradeRapporteur: '',
    president: '',
    gradePresident: '',
    notes: {
      forme: '04,00',
      fond: '06,00',
      expose: '05,00',
      defense: '05,00',
      total: '20,00'
    },
    observations: ''
  });

  const [filieres, setFilieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [binomes, setBinomes] = useState([]);
  const [monomes, setMonomes] = useState([]);
  const [selectedFiliereId, setSelectedFiliereId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [enseignants, setEnseignants] = useState([]);
  const printRef = useRef();

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les filières
        const filieresResponse = await axios.get('/api/filieres/');
        setFilieres(filieresResponse.data);
        
        // Charger tous les étudiants initialement
        const etudiantsResponse = await axios.get('/api/etudiants/');
        setEtudiants(etudiantsResponse.data);
        
        // Charger les binômes et monômes
        const binomesResponse = await axios.get('/api/binomes/');
        setBinomes(binomesResponse.data);
        
        const monomesResponse = await axios.get('/api/monomes/');
        setMonomes(monomesResponse.data);

        // Charger les enseignants
      const enseignantsResponse = await axios.get('/api/enseignants/');
      setEnseignants(enseignantsResponse.data);
      
      // Données simulées en cas d'échec
      if (enseignantsResponse.data.length === 0) {
        setEnseignants([
          { id: 1, nom: "Dupont", prenom: "Jean", grade: "PR", specialite: "Informatique", etablissement: "Université de Cotonou" },
          { id: 2, nom: "Martin", prenom: "Sophie", grade: "MC", specialite: "Gestion", etablissement: "Université d'Abomey" },
          { id: 3, nom: "Durand", prenom: "Pierre", grade: "DR", specialite: "Marketing", etablissement: "Université de Porto-Novo" }
        ]);
      }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        
        // Données simulées en cas d'échec de l'API
        setFilieres([
          { id: 1, code: "MECOB", libelle: "Expertise Commerciale et Business Development", niveau: "M2" },
          { id: 2, code: "IG", libelle: "Informatique de Gestion", niveau: "L3" },
          { id: 3, code: "CG", libelle: "Comptabilité et Gestion", niveau: "L3" },
          { id: 4, code: "MC", libelle: "Marketing et Communication", niveau: "M2" },
          { id: 5, code: "RH", libelle: "Ressources Humaines", niveau: "M2" }
        ]);
        
        setEtudiants([
          { matricule: "ET001", nom: "Doe", prenom: "John", date_naissance: "1995-05-15", lieu_naissance: "Cotonou", filiere: 2 },
          { matricule: "ET002", nom: "Smith", prenom: "Jane", date_naissance: "1996-08-20", lieu_naissance: "Porto-Novo", filiere: 2 },
          { matricule: "ET003", nom: "Johnson", prenom: "Robert", date_naissance: "1997-03-10", lieu_naissance: "Abomey", filiere: 3 }
        ]);
        
        setBinomes([
          { id: 1, etudiants: ["ET001", "ET002"], theme: "Système de gestion des ressources humaines" }
        ]);
        
        setMonomes([
          { id: 1, etudiant: "ET003", theme: "Gestion informatisée des stocks" }
        ]);
        
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les étudiants quand une filière est sélectionnée
  useEffect(() => {
    if (selectedFiliereId) {
      const filtered = etudiants.filter(etudiant => etudiant.filiere == selectedFiliereId);
      setEtudiants(filtered);
    }
  }, [selectedFiliereId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPvForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setPvForm(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [name]: value
      }
    }));
  };

  // Gestion du changement de spécialité
  const handleSpecialiteChange = (e) => {
    const selectedFiliereId = e.target.value;
    const selectedFiliere = filieres.find(f => f.id == selectedFiliereId);
    
    setSelectedFiliereId(selectedFiliereId);
    
    setPvForm(prev => ({
      ...prev,
      specialite: selectedFiliere ? `${selectedFiliere.libelle} (${selectedFiliere.code})` : '',
      diplome: selectedFiliere?.niveau === 'L3' 
        ? 'Licence professionnelle' 
        : 'Master professionnel',
      // Réinitialiser les champs étudiant quand on change de filière
      matricule: '',
      nom: '',
      prenoms: '',
      dateNaiss: '',
      lieuNaiss: '',
      theme: ''
    }));
  };

const handleEtudiantChange = (e) => {
    const matricule = e.target.value;
    const selectedEtudiant = etudiants.find(e => e.matricule === matricule);
    
    if (selectedEtudiant) {
      // Trouver le thème du mémoire (dans binome ou monome)
      let theme = '';
      
      // Chercher dans les binômes - vérifier si l'étudiant est dans un binôme
      const binome = binomes.find(b => 
        b.etudiants.some(etud => etud.matricule === selectedEtudiant.matricule)
      );
      
      if (binome) {
        theme = binome.theme;
      } else {
        // Si pas trouvé dans binôme, chercher dans monôme
        const monome = monomes.find(m => 
          m.etudiant.matricule === selectedEtudiant.matricule
        );
        if (monome) {
          theme = monome.theme;
        }
      }
      
      setPvForm(prev => ({
        ...prev,
        matricule: selectedEtudiant.matricule,
        nom: selectedEtudiant.nom,
        prenoms: selectedEtudiant.prenom,
        dateNaiss: selectedEtudiant.date_naissance,
        lieuNaiss: selectedEtudiant.lieu_naissance,
        theme: theme || "Thème non spécifié"
      }));
    }
  };

  const calculateTotal = () => {
    const total = (
      parseFloat(pvForm.notes.forme.replace(',', '.')) +
      parseFloat(pvForm.notes.fond.replace(',', '.')) +
      parseFloat(pvForm.notes.expose.replace(',', '.')) +
      parseFloat(pvForm.notes.defense.replace(',', '.'))
    ).toFixed(2).replace('.', ',');
    
    setPvForm(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        total: total
      }
    }));
  };

  const getMention = () => {
    const total = parseFloat(pvForm.notes.total.replace(',', '.'));
    if (total >= 18) return 'Excellent [18 - 20]';
    if (total >= 16) return 'Très-Bien [16 - 18[';
    if (total >= 14) return 'Bien [14 - 16[';
    if (total >= 12) return 'Assez-Bien [12 - 14[';
    if (total >= 10) return 'Passable [10 - 12[';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotal();
    setSubmitted(true);
    window.scrollTo({
      top: document.getElementById('print-section').offsetTop,
      behavior: 'smooth'
    });
  };

  const handleEdit = () => {
    setSubmitted(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

const handlePrint = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title></title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: Arial; }
        </style>
      </head>
      <body>
        ${printRef.current.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 1000);
};

  const grades = [
    "Master",
    "Ingénieur",
    "Docteur",
    "MA",
    "MC",
    "PT"
  ]


  const handleJuryMemberChange = (role, e) => {
    const selectedEnseignantId = e.target.value;
    const selectedEnseignant = enseignants.find(e => e.id == selectedEnseignantId);
    
    if (selectedEnseignant) {
      setPvForm(prev => ({
        ...prev,
        [role]: `${selectedEnseignant.prenom} ${selectedEnseignant.nom}`,
        [`grade${role.charAt(0).toUpperCase() + role.slice(1)}`]: selectedEnseignant.grade
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      {!submitted ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Formulaire de Procès-Verbal de Soutenance</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Informations Générales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Session</label>
                  <input 
                    type="text" 
                    name="session" 
                    value={pvForm.session}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Spécialité</label>
                  {loading ? (
                    <p>Chargement des filières...</p>
                  ) : (
                    <select 
                      name="specialite" 
                      onChange={handleSpecialiteChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionnez une spécialité</option>
                      {filieres.map(filiere => (
                        <option key={filiere.id} value={filiere.id}>
                          {filiere.libelle} ({filiere.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Diplôme</label>
                  <input 
                    type="text"
                    name="diplome" 
                    value={pvForm.diplome}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Numéro du Jury</label>
                  <input 
                    type="text" 
                    name="jury" 
                    value={pvForm.jury}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Salle</label>
                  <input 
                    type="text" 
                    name="salle" 
                    value={pvForm.salle}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Date de soutenance</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={pvForm.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Heure</label>
                  <input 
                    type="time" 
                    name="heure" 
                    value={pvForm.heure}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section Informations Étudiant */}
             <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Informations Étudiant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Nom</label>
                  <select
                    name="nom"
                    value={pvForm.matricule} // On utilise matricule comme value car c'est unique
                    onChange={handleEtudiantChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedFiliereId}
                    required
                  >
                    <option value="">Sélectionnez un étudiant</option>
                    {etudiants.map(etudiant => (
                      <option key={etudiant.matricule} value={etudiant.matricule}>
                        {etudiant.nom} {etudiant.prenom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Matricule</label>
                  <input 
                    type="text" 
                    name="matricule" 
                    value={pvForm.matricule}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Prénom(s)</label>
                  <input 
                    type="text" 
                    name="prenoms" 
                    value={pvForm.prenoms}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Date de naissance</label>
                  <input 
                    type="text" 
                    name="dateNaiss" 
                    value={pvForm.dateNaiss}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Lieu de naissance</label>
                  <input 
                    type="text" 
                    name="lieuNaiss" 
                    value={pvForm.lieuNaiss}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">Thème du mémoire</label>
                  <input 
                    type="text" 
                    name="theme" 
                    value={pvForm.theme}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section Notes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Forme du mémoire</label>
                  <input 
                    type="text" 
                    name="forme" 
                    value={pvForm.notes.forme}
                    onChange={handleNoteChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Fond du mémoire</label>
                  <input 
                    type="text" 
                    name="fond" 
                    value={pvForm.notes.fond}
                    onChange={handleNoteChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Exposé du candidat</label>
                  <input 
                    type="text" 
                    name="expose" 
                    value={pvForm.notes.expose}
                    onChange={handleNoteChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Défense du mémoire</label>
                  <input 
                    type="text" 
                    name="defense" 
                    value={pvForm.notes.defense}
                    onChange={handleNoteChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

       {/* Section Jury */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h3 className="text-lg font-semibold mb-4 text-blue-700">Membres du Jury</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Examinateur */}
    <div>
      <label className="block mb-2 font-medium">Examinateur</label>
      <select 
        name="examinateur" 
        onChange={(e) => handleJuryMemberChange('examinateur', e)}
        value={enseignants.find(e => `${e.prenom} ${e.nom}` === pvForm.examinateur)?.id || ''}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Sélectionnez un examinateur</option>
        {enseignants.map(enseignant => (
          <option key={enseignant.id} value={enseignant.id}>
            {enseignant.prenom} {enseignant.nom} ({enseignant.grade})
          </option>
        ))}
      </select>
      <label className="block mb-2 mt-2 font-medium">Grade</label>
      <input 
        type="text"
        name="gradeExaminateur" 
        value={pvForm.gradeExaminateur}
        readOnly
        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
      />
    </div>
    
    {/* Rapporteur */}
    <div>
      <label className="block mb-2 font-medium">Rapporteur</label>
      <select 
        name="rapporteur" 
        onChange={(e) => handleJuryMemberChange('rapporteur', e)}
        value={enseignants.find(e => `${e.prenom} ${e.nom}` === pvForm.rapporteur)?.id || ''}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Sélectionnez un rapporteur</option>
        {enseignants.map(enseignant => (
          <option key={enseignant.id} value={enseignant.id}>
            {enseignant.prenom} {enseignant.nom} ({enseignant.grade})
          </option>
        ))}
      </select>
      <label className="block mb-2 mt-2 font-medium">Grade</label>
      <input 
        type="text"
        name="gradeRapporteur" 
        value={pvForm.gradeRapporteur}
        readOnly
        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
      />
    </div>
    
    {/* Président */}
    <div>
      <label className="block mb-2 font-medium">Président</label>
      <select 
        name="president" 
        onChange={(e) => handleJuryMemberChange('president', e)}
        value={enseignants.find(e => `${e.prenom} ${e.nom}` === pvForm.president)?.id || ''}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Sélectionnez un président</option>
        {enseignants.map(enseignant => (
          <option key={enseignant.id} value={enseignant.id}>
            {enseignant.prenom} {enseignant.nom} ({enseignant.grade})
          </option>
        ))}
      </select>
      <label className="block mb-2 mt-2 font-medium">Grade</label>
      <input 
        type="text"
        name="gradePresident" 
        value={pvForm.gradePresident}
        readOnly
        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
      />
    </div>
  </div>
</div>

            {/* Observations */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Observations complémentaires</h3>
              <textarea 
                name="observations" 
                value={pvForm.observations}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              Générer le PV
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center space-x-4 mb-6 no-print">
          <button 
            onClick={handleEdit} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Modifier
          </button>
          <button 
            onClick={handlePrint} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Imprimer le PV
          </button>
        </div>
      )}

      {/* Section Aperçu/Impression */}
      <div
        id="print-section" 
        ref={printRef}
        className={`bg-white p-8 ${submitted ? 'block' : 'hidden'}`}
      >
        {/* En-tête avec logo et titre */}
<table cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
  <tbody>
    <tr style={{ height: '19.5pt' }}>
      <td 
        rowSpan="3" 
        style={{ 
          width: '109.45pt',
          paddingRight: '5.4pt',
          paddingLeft: '5.4pt',
          verticalAlign: 'top'
        }}
      >
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt' }}>
          {/* Remplacez cette div par votre image si nécessaire */}
          <img 
  src="data:image/png;base64,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"
  width="151"
  height="51"
  alt="Logo PIGIER BENIN"
/>
        </p>
      </td>
      <td 
        colSpan="3" 
        style={{ 
          width: '350.3pt',
          paddingRight: '5.4pt',
          paddingLeft: '5.4pt',
          verticalAlign: 'top'
        }}
      >
        <p style={{ 
          marginTop: '0pt', 
          marginBottom: '0pt', 
          textAlign: 'center', 
          fontSize: '14pt',
          fontWeight: 'bold'
        }}>
          PROCES-VERBAL DE SOUTENANCE DE MEMOIRE&nbsp;
        </p>
      </td>
    </tr>
    <tr style={{ height: '9.75pt' }}>
      <td style={{ 
        width: '53.25pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          Diplôme
        </p>
      </td>
      <td style={{ 
        width: '3.1pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          :
        </p>
      </td>
      <td style={{ 
        width: '272.35pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          {pvForm.diplome}
        </p>
      </td>
    </tr>
    <tr style={{ height: '9.75pt' }}>
      <td style={{ 
        width: '53.25pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          Spécialité
        </p>
      </td>
      <td style={{ 
        width: '3.1pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          :
        </p>
      </td>
      <td style={{ 
        width: '272.35pt',
        paddingRight: '5.4pt',
        paddingLeft: '5.4pt',
        verticalAlign: 'top'
      }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt', fontWeight: 'bold' }}>
          {pvForm.specialite}
        </p>
      </td>
    </tr>
  </tbody>
</table>
        
        <p style={{ marginTop: '6pt', marginBottom: '0pt' }}>
  Session de : {pvForm.session}<span style={{ width: '5.02pt', display: 'inline-block' }}>&nbsp;</span>
  <span style={{ width: '35.4pt', display: 'inline-block' }}>&nbsp;</span>
  Jury N° : {pvForm.jury}
  <span style={{ width: '34.96pt', display: 'inline-block' }}>&nbsp;</span>
  <span style={{ width: '35.4pt', display: 'inline-block' }}>&nbsp;</span>
  Salle : {pvForm.salle}
</p>

<p style={{ marginTop: '6pt', marginBottom: '0pt' }}>
  Date de soutenance : {pvForm.date}
  <span style={{ width: '11.51pt', display: 'inline-block' }}>&nbsp;</span>
  <span style={{ width: '35.4pt', display: 'inline-block' }}>&nbsp;</span>
  Heure : {pvForm.heure}
</p>

<p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '4pt' }}>&nbsp;</p>

<table cellSpacing="0" cellPadding="0" style={{ border: '0.75pt solid #000000', borderCollapse: 'collapse' }}>
  <tbody>
    <tr style={{ height: '12.55pt' }}>
      <td style={{ width: '149.65pt', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>N° matricule de l'Etudiant(e)</p>
      </td>
      <td style={{ width: '5.7pt', border: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>:</p>
      </td>
      <td style={{ width: '293.6pt', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>{pvForm.matricule}</p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '149.65pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>NOM ET Prénom(s)</p>
      </td>
      <td style={{ width: '5.7pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>:</p>
      </td>
      <td style={{ width: '293.6pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>{pvForm.nom} {pvForm.prenoms}</p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '149.65pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>Date et Lieu de naissance°</p>
      </td>
      <td style={{ width: '5.7pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>:</p>
      </td>
      <td style={{ width: '293.6pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>{pvForm.dateNaiss} à {pvForm.lieuNaiss}</p>
      </td>
    </tr>
    <tr style={{ height: '6.15pt' }}>
      <td style={{ width: '149.65pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>Thème</p>
      </td>
      <td style={{ width: '5.7pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>&nbsp;</p>
      </td>
      <td style={{ width: '293.6pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>{pvForm.theme}</p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '149.65pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>&nbsp;</p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>Signature de l'Etudiant(e)</p>
      </td>
      <td style={{ width: '5.7pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>:</p>
      </td>
      <td style={{ width: '293.6pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>&nbsp;</p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>&nbsp;</p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>&nbsp;</p>
      </td>
    </tr>
  </tbody>
</table>

<p style={{ marginTop: '0pt', marginBottom: '0pt' }}>&nbsp;</p>

<table cellSpacing="0" cellPadding="0" style={{ width: '482.45pt', border: '0.75pt solid #000000', borderCollapse: 'collapse' }}>
  <tbody>
    <tr>
      <td style={{ width: '258.3pt', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top', backgroundColor: '#f2f2f2' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>CRITERES D'EVALUATION</strong>
        </p>
      </td>
      <td style={{ width: '102.6pt', border: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top', backgroundColor: '#f2f2f2' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>OBSERVATIONS</strong>
        </p>
      </td>
      <td style={{ width: '88.4pt', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top', backgroundColor: '#f2f2f2' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>NOTE</strong>
        </p>
      </td>
    </tr>
    
    {/* Section 1 */}
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
          <strong>1. Forme du mémoire</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '102.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '88.4pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <div style={{ borderBottom: '0.75pt solid #000000', clear: 'both' }}>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', paddingBottom: '1pt', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '14pt' }}>
          <strong>04,00</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>1.1. Esthétique du document</strong> (Propreté - lisibilité - page de garde, Qualité des illustrations : tableaux – graphiques – figures – etc.)
        </p>
      </td>
    </tr>
    <tr style={{ height: '10.25pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>1.2. Structure du document</strong> (Rubriques obligatoires – Articulation et proportion des parties - chapitres – introduction – conclusion – etc.)
        </p>
      </td>
    </tr>
    <tr style={{ height: '10.25pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>1.3. Rédaction</strong> (Orthographe, grammaire, Style, syntaxe, etc.)
        </p>
      </td>
    </tr>
    
    {/* Section 2 */}
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
          <strong>2. Fond du mémoire</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '102.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '88.4pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <div style={{ borderBottom: '0.75pt solid #000000', clear: 'both' }}>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', paddingBottom: '1pt', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '14pt' }}>
          <strong>06,00</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          2.1. Maîtrise de la <strong>problématique</strong> et de la <strong>littérature</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          2.2. Rigueur <strong>méthodologique</strong> (Investigations, inventions, etc.)
        </p>
      </td>
    </tr>
    <tr style={{ height: '10.05pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          2.3. Pertinence des <strong>résultats</strong> pour la structure d'accueil, la société)
        </p>
      </td>
    </tr>
    
    {/* Section 3 */}
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong><span style={{ fontSize: '9pt' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong>
          <strong>3. Exposé du candidat (<em>Speech</em>)</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '102.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '88.4pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <div style={{ borderBottom: '0.75pt solid #000000', clear: 'both' }}>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', paddingBottom: '1pt', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '14pt' }}>
          <strong>05,00</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>3.1. Qualité des supports de présentation</strong> (Powerpoint, réalisations telles que : application développée, solution inventée, etc.)
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>3.2 Rigueur du raisonnement</strong> (Cohérence, logique de l'exposé, clarté, précision, diction, correction de l'expression, etc.)
        </p>
      </td>
    </tr>
    <tr style={{ height: '12.35pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>3.3. Gestion du temps et expression corporelle</strong>
        </p>
      </td>
    </tr>
    
    {/* Section 4 */}
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          <strong><span style={{ fontSize: '9pt' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong>
          <strong>4. Défense du mémoire par le candidat</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>(Intelligence situationnelle)</strong>
        </p>
      </td>
      <td rowSpan="4" style={{ width: '102.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          &nbsp;
        </p>
      </td>
      <td rowSpan="4" style={{ width: '88.4pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <div style={{ borderBottom: '0.75pt solid #000000', clear: 'both' }}>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', paddingBottom: '1pt', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '14pt' }}>
          <strong>05,00</strong>
        </p>
      </td>
    </tr>
    <tr style={{ height: '10.25pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          4.1. Expression corporelle (Tenue, aisance, courtoisie…)
        </p>
      </td>
    </tr>
    <tr style={{ height: '10.25pt' }}>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          4.2. Réponse aux questions (Précision, concision, justesse, etc.)
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          4.3. Gestion de situations difficiles lors de la soutenance
        </p>
      </td>
    </tr>
    
    {/* Observations and Total */}
    <tr>
      <td style={{ width: '258.3pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '9pt' }}>
          <strong>Observations complémentaires du Jury</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td style={{ width: '102.6pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'right', fontSize: '14pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'right', fontSize: '14pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'right', fontSize: '14pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'right', fontSize: '14pt' }}>
          <strong>Total</strong>
        </p>
      </td>
      <td style={{ width: '88.4pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <div style={{ borderBottom: '0.75pt solid #000000', clear: 'both' }}>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
          <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', paddingBottom: '1pt', fontSize: '10pt' }}>
            <strong>&nbsp;</strong>
          </p>
        </div>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '14pt' }}>
          <strong>20,00</strong>
        </p>
      </td>
    </tr>
  </tbody>
</table>

<p style={{ marginTop: '12pt', marginBottom: '0pt', textAlign: 'center' }}>
  <strong>Mention (Cochez la case en dessous la mention)</strong>
</p>

<table cellSpacing="0" cellPadding="0" style={{ width: '482.45pt', border: '1pt solid #000000', borderCollapse: 'collapse' }}>
  <tbody>
    <tr style={{ height: '15.75pt' }}>
      <td style={{ width: '91.75pt', borderRight: '1pt solid #000000', borderBottom: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>Excellent</strong><strong>&nbsp;</strong><strong>[18 – 20]</strong>
        </p>
      </td>
      <td style={{ width: '92.2pt', borderRight: '1pt solid #000000', borderBottom: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>Très-Bien [16 - 18[</strong>
        </p>
      </td>
      <td style={{ width: '71pt', borderRight: '1pt solid #000000', borderBottom: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>Bien [14 - 16[</strong>
        </p>
      </td>
      <td style={{ width: '99.3pt', borderRight: '1pt solid #000000', borderBottom: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>Assez-Bien</strong><strong>&nbsp;</strong><strong>[12 - 12[</strong>
        </p>
      </td>
      <td style={{ width: '92.2pt', borderBottom: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>Passable [10 - 12[</strong>
        </p>
      </td>
    </tr>
    <tr style={{ height: '17.15pt' }}>
      <td style={{ width: '91.75pt', borderRight: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td style={{ width: '92.2pt', borderRight: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td style={{ width: '71pt', borderRight: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td style={{ width: '99.3pt', borderRight: '1pt solid #000000', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
      <td style={{ width: '92.2pt', paddingRight: '3pt', paddingLeft: '3.5pt', verticalAlign: 'middle' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>&nbsp;</strong>
        </p>
      </td>
    </tr>
  </tbody>
</table>

<p style={{ marginTop: '12pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
  Cotonou, le ..................................................................................................
</p>

<p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '4pt' }}>
  &nbsp;
</p>

<p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
  Fonction, Signature, NOM, Prénoms, Grade (Master/Ingénieur/Docteur/MA/MC/PT) des membres du Jury
</p>

<table cellSpacing="0" cellPadding="0" style={{ border: '0.75pt solid #000000', borderCollapse: 'collapse' }}>
  <tbody>
    <tr>
      <td style={{ width: '66.95pt', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '11pt' }}>
          <strong>Fonction</strong>
        </p>
      </td>
      <td style={{ width: '123.6pt', border: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>Examinateur</strong>
        </p>
      </td>
      <td style={{ width: '131.2pt', border: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>Rapporteur</strong>
        </p>
      </td>
      <td style={{ width: '116.15pt', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '11pt' }}>
          <strong>Président</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '66.95pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>&nbsp;</strong>
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>Signature</strong>
        </p>
      </td>
      <td style={{ width: '123.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          &nbsp;
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          &nbsp;
        </p>
      </td>
      <td style={{ width: '131.2pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          &nbsp;
        </p>
      </td>
      <td style={{ width: '116.15pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          &nbsp;
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          &nbsp;
        </p>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>
          &nbsp;
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '66.95pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>NOM Prénoms</strong>
        </p>
      </td>
      <td style={{ width: '123.6pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>{pvForm.examinateur}</strong>
        </p>
      </td>
      <td style={{ width: '131.2pt', border: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>{pvForm.rapporteur}</strong>
        </p>
      </td>
      <td style={{ width: '116.15pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', borderBottom: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          <strong>{pvForm.president}</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style={{ width: '66.95pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', fontSize: '9pt' }}>
          <strong>Grade</strong>
        </p>
      </td>
      <td style={{ width: '123.6pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          {pvForm.gradeExaminateur}
        </p>
      </td>
      <td style={{ width: '131.2pt', borderTop: '0.75pt solid #000000', borderRight: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          {pvForm.gradeRapporteur}
        </p>
      </td>
      <td style={{ width: '116.15pt', borderTop: '0.75pt solid #000000', borderLeft: '0.75pt solid #000000', paddingRight: '5.03pt', paddingLeft: '5.03pt', verticalAlign: 'top' }}>
        <p style={{ marginTop: '0pt', marginBottom: '0pt', textAlign: 'center', fontSize: '10pt' }}>
          {pvForm.gradePresident}
        </p>
      </td>
    </tr>
  </tbody>
</table>

<p style={{ marginTop: '0pt', marginBottom: '0pt' }}>&nbsp;</p>
      </div>
    </div>
  );
};

export default PvSoutenance;