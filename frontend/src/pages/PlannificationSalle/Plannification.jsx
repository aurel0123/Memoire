import { useState, useEffect } from 'react';

const Planification = () => {
  // Styles intégrés
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      fontSize: '1.5em',
      marginBottom: '10px'
    },
    date: {
      textAlign: 'center',
      marginBottom: '15px',
      fontWeight: 'bold',
      fontSize: '1.1em'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px'
    },
    fullscreenTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '10px',
      fontSize: '0.85em'
    },
    cell: {
      border: '1px solid #ddd',
      padding: '6px',
      textAlign: 'center',
      fontSize: '0.9em'
    },
    headerCell: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      padding: '8px',
      fontSize: '0.95em'
    },
    select: {
      width: '100%',
      padding: '4px',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
      fontSize: '0.9em'
    },
    note: {
      fontStyle: 'italic',
      fontSize: '0.85em',
      textAlign: 'center',
      marginTop: '10px'
    },
    selectedSpecialites: {
      marginTop: '3px',
      padding: '3px',
      backgroundColor: '#f8f8f8',
      borderRadius: '3px',
      minHeight: '18px',
      fontSize: '0.85em'
    },
    fullscreenButton: {
      display: 'block',
      margin: '15px auto',
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9em'
    },
    fullscreenMode: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      zIndex: 1000,
      overflow: 'auto',
      padding: '10px',
      boxSizing: 'border-box'
    },
    fullscreenContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    fullscreenTablesContainer: {
      display: 'flex',
      flex: 1,
      gap: '20px',
      marginBottom: '10px'
    },
    fullscreenColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    fullscreenTableContainer: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    fullscreenTableWrapper: {
      flex: 1,
      overflow: 'auto',
      marginBottom: '10px'
    },
    timeIndicator: {
      textAlign: 'center',
      fontSize: '1.1em',
      fontWeight: 'bold',
      margin: '5px 0 10px 0',
      color: '#333'
    },
    columnTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '1.1em'
    }
  };

  // Liste des spécialités disponibles
  const specialites = [
    'RGL1', 
    'RGL2',
    'RGL3',
    'RMS1',
    'RMS2',
    'RMS3'
  ];

  // Génération des heures de 08h à 18h
  const heures = Array.from({ length: 11 }, (_, i) => {
    const heure = i + 8;
    return heure < 10 ? `0${heure}h` : `${heure}h`;
  });
  heures.unshift(''); // Option vide

  // État initial basé sur le tableau de l'image
  const [salles, setSalles] = useState([
    { id: 1, salleMatin: '1A', specialiteMatin: [], heureMatin: '', salleApresMidi: '1A', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 2, salleMatin: '2', specialiteMatin: [], heureMatin: '', salleApresMidi: '2', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 3, salleMatin: 'DECO 1', specialiteMatin: [], heureMatin: '', salleApresMidi: 'DECO 1', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 4, salleMatin: 'DECO 2', specialiteMatin: [], heureMatin: '', salleApresMidi: 'DECO 2', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 5, salleMatin: 'DESCOGEF 1', specialiteMatin: [], heureMatin: '', salleApresMidi: 'DESCOGEF 1', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 6, salleMatin: '5A', specialiteMatin: [], heureMatin: '', salleApresMidi: '5A', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 7, salleMatin: '6', specialiteMatin: [], heureMatin: '', salleApresMidi: '6', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 8, salleMatin: '7', specialiteMatin: [], heureMatin: '', salleApresMidi: '7', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 9, salleMatin: '8', specialiteMatin: [], heureMatin: '', salleApresMidi: '8', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 10, salleMatin: '10', specialiteMatin: [], heureMatin: '', salleApresMidi: '10', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 11, salleMatin: '11', specialiteMatin: [], heureMatin: '', salleApresMidi: '11', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 12, salleMatin: '12', specialiteMatin: [], heureMatin: '', salleApresMidi: '12', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 13, salleMatin: 'RGL', specialiteMatin: [], heureMatin: '', salleApresMidi: 'RGL', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 14, salleMatin: '1B', specialiteMatin: [], heureMatin: '', salleApresMidi: '1B', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 15, salleMatin: 'DESCOGEF 2', specialiteMatin: [], heureMatin: '', salleApresMidi: 'DESCOGEF 2', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 16, salleMatin: 'Salle info (3e)', specialiteMatin: [], heureMatin: '', salleApresMidi: 'Salle info (3e)', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 17, salleMatin: 'Salle info(4e)', specialiteMatin: [], heureMatin: '', salleApresMidi: 'Salle info(4e)', specialiteApresMidi: [], heureApresMidi: '' },
    { id: 19, salleMatin: '5B', specialiteMatin: [], heureMatin: '', salleApresMidi: '5B', specialiteApresMidi: [], heureApresMidi: '' }
  ]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMorning = currentTime.getHours() < 13;

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 000 ms = 1 minute
    
    return () => clearInterval(timer);
  }, []);

  const handleSpecialiteChange = (id, field, selectedValue) => {
    setSalles(salles.map(salle => {
      if (salle.id === id) {
        if (salle[field].includes(selectedValue)) {
          return {
            ...salle,
            [field]: salle[field].filter(val => val !== selectedValue)
          };
        } else {
          return {
            ...salle,
            [field]: [...salle[field], selectedValue]
          };
        }
      }
      return salle;
    }));
  };

  const handleInputChange = (id, field, value) => {
    setSalles(salles.map(salle => 
      salle.id === id ? { ...salle, [field]: value } : salle
    ));
  };

  const formatSpecialites = (specialitesArray) => {
    return specialitesArray.join(' / ') || '-- Aucune sélection --';
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Diviser les salles en deux groupes pour l'affichage en deux colonnes
  const firstColumnSalles = salles.slice(0, 10);
  const secondColumnSalles = salles.slice(10);

  return (
    <div style={isFullscreen ? styles.fullscreenMode : styles.container}>
      <div style={isFullscreen ? {...styles.fullscreenContent, height: '100%'} : null}>
        <h2 style={styles.title}>FICHE D&apos;ATTRIBUTION DE SALLE</h2>
        <div style={styles.date}>DATE : {currentTime.toLocaleDateString('fr-FR')}</div>
        
        {isFullscreen && (
          <div style={styles.timeIndicator}>
            {isMorning ? (
              <span>Matinée (Heure actuelle: {formatTime(currentTime)})</span>
            ) : (
              <span>Après-midi (Heure actuelle: {formatTime(currentTime)})</span>
            )}
          </div>
        )}
        
        {!isFullscreen ? (
          <div style={styles.fullscreenTableContainer}>
            <div style={styles.fullscreenTableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{...styles.cell, ...styles.headerCell, width: '5%'}}>N°</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '15%'}}>SALLE MATIN</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '35%'}}>SPÉCIALITÉS</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '15%'}}>HEURE</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '15%'}}>SALLE APRÈS-MIDI</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '35%'}}>SPÉCIALITÉS</th>
                    <th style={{...styles.cell, ...styles.headerCell, width: '15%'}}>HEURE</th>
                  </tr>
                </thead>
                <tbody>
                  {salles.map((salle) => (
                    <tr key={salle.id}>
                      <td style={{...styles.cell, width: '5%'}}>{salle.id}</td>
                      <td style={{...styles.cell, width: '15%'}}>{salle.salleMatin}</td>
                      <td style={{...styles.cell, width: '35%'}}>
                        <div style={styles.selectedSpecialites}>
                          {formatSpecialites(salle.specialiteMatin)}
                        </div>
                        <select
                          value=""
                          onChange={(e) => handleSpecialiteChange(salle.id, 'specialiteMatin', e.target.value)}
                          style={styles.select}
                        >
                          <option value="">-- Ajouter --</option>
                          {specialites.map((spec, index) => (
                            <option 
                              key={`matin-${salle.id}-${index}`} 
                              value={spec}
                              disabled={salle.specialiteMatin.includes(spec)}
                            >
                              {spec} {salle.specialiteMatin.includes(spec) ? '(déjà sélectionné)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{...styles.cell, width: '15%'}}>
                        <select
                          value={salle.heureMatin}
                          onChange={(e) => handleInputChange(salle.id, 'heureMatin', e.target.value)}
                          style={styles.select}
                        >
                          {heures.map((heure, index) => (
                            <option key={`heure-matin-${salle.id}-${index}`} value={heure}>
                              {heure || '-- Heure --'}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{...styles.cell, width: '15%'}}>{salle.salleApresMidi}</td>
                      <td style={{...styles.cell, width: '35%'}}>
                        <div style={styles.selectedSpecialites}>
                          {formatSpecialites(salle.specialiteApresMidi)}
                        </div>
                        <select
                          value=""
                          onChange={(e) => handleSpecialiteChange(salle.id, 'specialiteApresMidi', e.target.value)}
                          style={styles.select}
                        >
                          <option value="">-- Ajouter --</option>
                          {specialites.map((spec, index) => (
                            <option 
                              key={`aprem-${salle.id}-${index}`} 
                              value={spec}
                              disabled={salle.specialiteApresMidi.includes(spec)}
                            >
                              {spec} {salle.specialiteApresMidi.includes(spec) ? '(déjà sélectionné)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{...styles.cell, width: '15%'}}>
                        <select
                          value={salle.heureApresMidi}
                          onChange={(e) => handleInputChange(salle.id, 'heureApresMidi', e.target.value)}
                          style={styles.select}
                        >
                          {heures.map((heure, index) => (
                            <option key={`heure-aprem-${salle.id}-${index}`} value={heure}>
                              {heure || '-- Heure --'}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={styles.fullscreenTablesContainer}>
            {/* Première colonne (10 premières salles) */}
            <div style={styles.fullscreenColumn}>
              <div style={styles.columnTitle}>Salles 1 à 10</div>
              <div style={styles.fullscreenTableContainer}>
                <div style={styles.fullscreenTableWrapper}>
                  <table style={styles.fullscreenTable}>
                    <thead>
                      <tr>
                        <th style={{...styles.cell, ...styles.headerCell, width: '10%'}}>N°</th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '20%'}}>
                          {isMorning ? 'SALLE MATIN' : 'SALLE APRÈS-MIDI'}
                        </th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '50%'}}>SPÉCIALITÉS</th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '20%'}}>HEURE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstColumnSalles.map((salle) => (
                        <tr key={salle.id}>
                          <td style={{...styles.cell, width: '10%'}}>{salle.id}</td>
                          <td style={{...styles.cell, width: '20%'}}>
                            {isMorning ? salle.salleMatin : salle.salleApresMidi}
                          </td>
                          <td style={{...styles.cell, width: '50%'}}>
                            <div style={styles.selectedSpecialites}>
                              {formatSpecialites(isMorning ? salle.specialiteMatin : salle.specialiteApresMidi)}
                            </div>
                          </td>
                          <td style={{...styles.cell, width: '20%'}}>
                            {isMorning ? (salle.heureMatin || '--') : (salle.heureApresMidi || '--')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Deuxième colonne (salles restantes) */}
            <div style={styles.fullscreenColumn}>
              <div style={styles.columnTitle}>Salles 11 à {salles.length}</div>
              <div style={styles.fullscreenTableContainer}>
                <div style={styles.fullscreenTableWrapper}>
                  <table style={styles.fullscreenTable}>
                    <thead>
                      <tr>
                        <th style={{...styles.cell, ...styles.headerCell, width: '10%'}}>N°</th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '20%'}}>
                          {isMorning ? 'SALLE MATIN' : 'SALLE APRÈS-MIDI'}
                        </th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '50%'}}>SPÉCIALITÉS</th>
                        <th style={{...styles.cell, ...styles.headerCell, width: '20%'}}>HEURE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {secondColumnSalles.map((salle) => (
                        <tr key={salle.id}>
                          <td style={{...styles.cell, width: '10%'}}>{salle.id}</td>
                          <td style={{...styles.cell, width: '20%'}}>
                            {isMorning ? salle.salleMatin : salle.salleApresMidi}
                          </td>
                          <td style={{...styles.cell, width: '50%'}}>
                            <div style={styles.selectedSpecialites}>
                              {formatSpecialites(isMorning ? salle.specialiteMatin : salle.specialiteApresMidi)}
                            </div>
                          </td>
                          <td style={{...styles.cell, width: '20%'}}>
                            {isMorning ? (salle.heureMatin || '--') : (salle.heureApresMidi || '--')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.note}>
          NB: Cette programmation est susceptible de modification à tout moment de la journée
        </div>

        <button 
          onClick={toggleFullscreen} 
          style={styles.fullscreenButton}
        >
          {isFullscreen ? 'Réduire' : 'Afficher en plein écran'}
        </button>
      </div>
    </div>
  );
};

export default Planification;