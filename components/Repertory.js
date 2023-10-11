const node_choice = [
  ['Home', 'Home'],
  ['Local', 'Local'],
  ['Remote', 'Remote']
];

const state_block = [
  ['1', 'Uncached'],
  ['2', 'Shared'],
  ['3', 'Modified'],
  ['4', 'Invalid']
];

const msg_type_choice = [
  ['1', "Read Miss"],
  ['2', "Write Miss"],
  ['3', "Data Value Reply"],
  ['4', "Invalidate"],
  ['5', "Fetch"],
  ['6', "Fetch/Invalidate"],
  ['7', "Data Write-Back"]
];


class Node {
  constructor(name, numero) {
      this.name = name;
      this.numero = numero;
  }

  // toString() {
  //     return `Node ${this.numero} - ${this.name}`;
  // }

  get node_name() {
      return `Node ${this.numero}`;
  }

  get all_caches() {
      return CacheNode.filter(node => node.node === this).sort((a, b) => b.id - a.id);
  }
}

class MemoryBloc {
  constructor(block_num, data) {
      this.block_num = block_num;
      this.data = data;
  }

  // toString() {
  //     return `B${this.block_num}`;
  // }

  get string_block() {
      return `B${this.block_num}`;
  }
}

class Directory {
  constructor(bloc, state, owner_bits) {
      this.bloc = bloc;
      this.state = state;
      this.owner_bits = owner_bits;
  }

  // toString() {
  //     return this.bloc.toString();
  // }

  get string_block() {
      return `B${this.bloc.block_num}`;
  }

  get state_directory() {
      switch (this.state) {
          case '1':
              return 'Uncached';
          case '2':
              return 'Shared';
          case '3':
              return 'Modified';
          case '4':
              return 'Invalid';
          default:
              return this.state;
      }
  }
}

class CacheNode {
  constructor(node, bloc, state_cache) {
      this.node = node;
      this.bloc = bloc;
      this.state_cache = state_cache;
  }

  // toString() {
  //     return `${this.node.name} B${this.bloc.block_num}`;
  // }

  get state_cache_state() {
      switch (this.state_cache) {
          case '2':
              return 'Shared';
          case '3':
              return 'Modified';
          case '4':
              return 'Invalid';
          default:
              return this.state_cache;
      }
  }
}

class SimulationMessage {
  constructor(type_message, source, destination, content_msg) {
      this.type_message = type_message;
      this.source = source;
      this.destination = destination;
      this.content_msg = content_msg;
  }

  // toString() {
  //     return this.type_message;
  // }

  get message() {
      const index = parseInt(this.type_message) - 1;
      return msg_type_choice[index][1];
  }
}
