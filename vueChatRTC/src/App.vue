<template>
  <div>
    <h1>Benvingut</h1>
    <h3>Posa el nom:</h3>
    <input v-model="nom" type="text">
    <button @click="connectar">Connectar</button>
    <div v-if="connectat">
      <h3>Usuaris Connectats:</h3>
      <ul>
        <li v-for="usuari in usuaris" :key="usuari.id">
          <a @click="iniciarXat(usuari.id)">{{ usuari.nom }}</a>
        </li>
      </ul>
    </div>
    <div v-if="xatActiu">
      <h3>Chat amb {{ usuariActiu.nom }}</h3>
      <textarea v-model="missatge"></textarea>
      <button @click="enviarMissatge">Enviar</button>
      <div v-for="missatge in xats[usuariActiu.id]" :key="missatge.timestamp">
        <strong>{{ missatge.sender }}:</strong> {{ missatge.text }}
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      nom: '',
      connectat: false,
      usuaris: [],
      xatActiu: false,
      usuariActiu: null,
      xats: {},
      missatge: '',
      socket: null,
      peer: null,
    };
  },
  methods: {
    connectar() {
      this.socket = io('http://localhost:3000');

      this.peer = new SimplePeer({
        initiator: false,
        trickle: false,
      });

      this.peer.on('signal', (data) => {
        this.socket.emit('signal', this.nom, JSON.stringify(data));
      });

      this.socket.on('connectat', (usuaris) => {
        this.usuaris = usuaris;
        this.connectat = true;
      });

      this.socket.on('nou-usuari', (nouUsuari) => {
        this.usuaris.push(nouUsuari);
      });

      this.socket.on('signal', (nom, signal) => {
        const user = this.usuaris.find((u) => u.nom === nom);
        if (user) {
          this.peer.signal(JSON.parse(signal));
        }
      });

      this.socket.on('missatge', (sender, text) => {
        const userId = this.usuaris.find((u) => u.nom === sender).id;
        this.xats[userId] = this.xats[userId] || [];
        this.xats[userId].push({ sender, text, timestamp: Date.now() });
      });
    },
    iniciarXat(userId) {
      this.xatActiu = true;
      this.usuariActiu = this.usuaris.find((usuari) => usuari.id === userId);
      this.xats[userId] = this.xats[userId] || [];

      const targetPeer = new SimplePeer({
        initiator: true,
        trickle: false,
      });

      targetPeer.on('signal', (data) => {
        this.socket.emit('signal', this.nom, JSON.stringify(data));
      });

      targetPeer.on('connect', () => {
        console.log('CONNECT');
      });

      targetPeer.on('data', (data) => {
        const sender = this.usuaris.find((u) => u.id === userId).nom;
        this.xats[userId].push({ sender, text: data.toString(), timestamp: Date.now() });
      });

      this.xats[userId].push({ sender: 'System', text: 'Chat iniciat', timestamp: Date.now() });
    },
    enviarMissatge() {
      this.xats[this.usuariActiu.id].push({ sender: this.nom, text: this.missatge, timestamp: Date.now() });
      this.peer.send(this.missatge);
      this.missatge = '';
    },
  },
};
</script>


