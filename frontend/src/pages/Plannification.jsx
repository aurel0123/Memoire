import React, { useState } from 'react';

const Planification = () => {
  // Styles intégrés
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    title: {
      textAlign: 'center',
      color: '#333'
    },
    date: {
      textAlign: 'right',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px'
    },
    cell: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center'
    },
    headerCell: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '5px',
      border: '1px solid #ddd',
      boxSizing: 'border-box'
    },
    note: {
      fontStyle: 'italic',
      fontSize: '0.9em',
      textAlign: 'center',
      marginTop: '10px'
    }
  };

  // État initial basé sur le tableau de l'image
  const [salles, setSalles] = useState([
    { id: 1, salleMatin: 'I.A.', specialiteMatin: '', heureMatin: '', salleApresMidi: 'I.A.', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 2, salleMatin: '2', specialiteMatin: '', heureMatin: '', salleApresMidi: '2', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 3, salleMatin: 'DECO 1', specialiteMatin: '', heureMatin: '', salleApresMidi: 'DECO 1', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 4, salleMatin: 'DECO 2', specialiteMatin: 'E.L.T.', heureMatin: '', salleApresMidi: 'DELO 2', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 5, salleMatin: 'DESCO GEF 1', specialiteMatin: 'GEČ, GeÚs Môžete a ve OTH', heureMatin: '', salleApresMidi: 'DESCO GEF 1', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 6, salleMatin: '5.A.', specialiteMatin: '', heureMatin: '', salleApresMidi: '5.A.', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 7, salleMatin: '6', specialiteMatin: '', heureMatin: '', salleApresMidi: '6', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 8, salleMatin: '7', specialiteMatin: '', heureMatin: '', salleApresMidi: '7', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 9, salleMatin: '8', specialiteMatin: '', heureMatin: '', salleApresMidi: '8', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 10, salleMatin: '10', specialiteMatin: '', heureMatin: '', salleApresMidi: '10', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 11, salleMatin: '11', specialiteMatin: '', heureMatin: '', salleApresMidi: '11', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 12, salleMatin: '12', specialiteMatin: '', heureMatin: '', salleApresMidi: '12', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 13, salleMatin: 'R.G.L.', specialiteMatin: '', heureMatin: '', salleApresMidi: 'R.G.L.', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 14, salleMatin: 'I.B.', specialiteMatin: 'Examen Familias Selçon 2', heureMatin: '', salleApresMidi: 'DELO 1 B', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 15, salleMatin: 'DESCO GEF 2', specialiteMatin: '', heureMatin: '', salleApresMidi: 'DESCO GEF 2', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 16, salleMatin: 'SALLE INFO 1 AU Jeune', specialiteMatin: '', heureMatin: '', salleApresMidi: 'SALLE INFO 1 AU Jeune', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 17, salleMatin: 'SALLE INFO 2 AU Jeune', specialiteMatin: '', heureMatin: '', salleApresMidi: 'SALLE INFO 2 AU Jeune', specialiteApresMidi: '', heureApresMidi: '' },
    { id: 18, salleMatin: '5.B.', specialiteMatin: '', heureMatin: '', salleApresMidi: '5.B.', specialiteApresMidi: '', heureApresMidi: '' }
  ]);

  const handleInputChange = (id, field, value) => {
    setSalles(salles.map(salle => 
      salle.id === id ? { ...salle, [field]: value } : salle
    ));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>FICHE D'ATTRIBUTION DE SALLE</h2>
      <div style={styles.date}>DATE : 2024-2025</div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{...styles.cell, ...styles.headerCell}}>N°</th>
            <th style={{...styles.cell, ...styles.headerCell}}>SALLE N°</th>
            <th style={{...styles.cell, ...styles.headerCell}}>MATINEE SPECIALITES</th>
            <th style={{...styles.cell, ...styles.headerCell}}>HEURE</th>
            <th style={{...styles.cell, ...styles.headerCell}}>SALLE N°</th>
            <th style={{...styles.cell, ...styles.headerCell}}>APRES-MIDI SPECIALITES</th>
            <th style={{...styles.cell, ...styles.headerCell}}>HEURE</th>
          </tr>
        </thead>
        <tbody>
          {salles.map((salle) => (
            <tr key={salle.id}>
              <td style={styles.cell}>{salle.id}</td>
              <td style={styles.cell}>{salle.salleMatin}</td>
              <td style={styles.cell}>
                <input 
                  type="text" 
                  value={salle.specialiteMatin} 
                  onChange={(e) => handleInputChange(salle.id, 'specialiteMatin', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.cell}>
                <input 
                  type="text" 
                  value={salle.heureMatin} 
                  onChange={(e) => handleInputChange(salle.id, 'heureMatin', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.cell}>{salle.salleApresMidi}</td>
              <td style={styles.cell}>
                <input 
                  type="text" 
                  value={salle.specialiteApresMidi} 
                  onChange={(e) => handleInputChange(salle.id, 'specialiteApresMidi', e.target.value)}
                  style={styles.input}
                />
              </td>
              <td style={styles.cell}>
                <input 
                  type="text" 
                  value={salle.heureApresMidi} 
                  onChange={(e) => handleInputChange(salle.id, 'heureApresMidi', e.target.value)}
                  style={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={styles.note}>
        NB: Cette programmation est susceptible de modification à tout moment de la journée
      </div>
    </div>
  );
};

export default Planification;