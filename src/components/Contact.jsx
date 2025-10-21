import React from 'react'

export default function Contact(){
  return (
  <section id="contact" className="p-4 bg-white rounded mt-4 section-separator">
      <h2>Contacto</h2>
      <p>¿Tenés consultas o querés hacer un pedido? Comunicáte con nosotros:</p>
      <ul>
        <li>Teléfono: <strong>+54 9 2494638919</strong></li>
        <li>Email: <strong>contacto@pizzerianapoles.com</strong></li>
  <li>Dirección: <strong>Fuerte Independencia 245, Tandil</strong></li>
      </ul>
        <div className="row g-3 mt-2">
          <div className="col-lg-6">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" placeholder="Tu nombre" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input className="form-control" placeholder="tu@ejemplo.com" />
                </div>
                <div className="col-12">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows="3" placeholder="Escribe tu mensaje..."></textarea>
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-danger">Enviar</button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-6">
            <div className="ratio ratio-16x9 rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.123456789012!2d-59.1377777!3d-37.3233333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9593498b1a2b3c4d%3A0xabcdef1234567890!2sFuerte%20Independencia%20245%2C%20Tandil!5e0!3m2!1ses!2sar!4v1697890000000"
                style={{border:0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      
    </section>
  )
}
