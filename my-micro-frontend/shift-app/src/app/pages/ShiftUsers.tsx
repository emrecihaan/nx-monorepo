export function ShiftUsers() {
  // Örnek sahte (mock) veri
  const users = [
    { id: 1, name: 'Ahmet Yılmaz', shift: 'Gündüz', date: '2024-05-20' },
    { id: 2, name: 'Ayşe Kaya', shift: 'Akşam', date: '2024-05-20' },
    { id: 3, name: 'Mehmet Demir', shift: 'Gece', date: '2024-05-21' },
  ];

  return (
    <div style={{ padding: '0 20px 20px 20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333' }}>Vardiya Kullanıcıları</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Sisteme kayıtlı vardiya atamaları listelenmektedir.
      </p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', maxWidth: '600px', background: '#fff', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Ad Soyad</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Vardiya Tipi</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{user.name}</td>
              <td style={{ padding: '12px' }}>{user.shift}</td>
              <td style={{ padding: '12px' }}>{user.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShiftUsers;
