export function ShiftForm() {
  return (
    <div style={{ padding: '0 20px 20px 20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333' }}>Yeni Vardiya Formu</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Lütfen yeni bir vardiya planlaması oluşturmak için formu doldurun.
      </p>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }} onSubmit={(e) => e.preventDefault()}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Personel Adı</label>
          <input type="text" placeholder="Örn: Ahmet Yılmaz" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Vardiya Tipi</label>
          <select style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}>
            <option>Gündüz (08:00 - 16:00)</option>
            <option>Akşam (16:00 - 00:00)</option>
            <option>Gece (00:00 - 08:00)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Tarih</label>
          <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Vardiyayı Kaydet
        </button>
      </form>
    </div>
  );
}

export default ShiftForm;
