
<template>
  <div>
    <h1>Benvingut</h1>
    <h3>Posa el nom:</h3>
    <input v-model="nom" type="text">
    <button @click="connectar">Connectar</button>
    <div v-if="connectat">
      <h3>Usuaris Connectats:</h3>
      <ul>
        <li v-for="usuari in usuaris" :key="usuari.id">{{ usuari.nom }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import SimplePeer from 'simple-peer';

export default {
  data() {
    return {
      nom: '',
      connectat: false,
      usuaris: []
    };
  },
  methods: {
    connectar() {
      // Crea una nueva instancia de SimplePeer
      const p = new SimplePeer({
        initiator: true, // Hacerlo siempre como iniciador
        trickle: false
      });

      // Manejar eventos de SimplePeer
      p.on('error', err => console.log('error', err));

      p.on('signal', data => {
        // Enviar la señal al servidor o a otros usuarios
        console.log('SIGNAL', JSON.stringify(data));
        this.enviarSignal(JSON.stringify(data));
      });

      p.on('connect', () => {
        console.log('CONNECT');
        this.usuaris.push({ id: this.usuaris.length + 1, nom: this.nom });
        this.connectat = true;
      });

      p.on('data', data => {
        console.log('data: ' + data);
      });
    },
    enviarSignal(signal) {
      // Enviar la señal al servidor o a otros usuarios
      console.log('Enviando señal al servidor o a otros usuarios:', signal);
    }
  }
};

</script>


