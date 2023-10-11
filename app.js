
import { CacheNode } from './components/Repertory.js';
import { Directory } from './components/Repertory.js';
import { SimulationMessage } from './components/Repertory.js';
import { Node } from './components/Repertory.js';
import { MemoryBloc } from './components/Repertory.js';
import { msg_type_choice } from './components/Repertory.js';



// Generateur de message
function message_sender(type_message, source, dest, content_msg) {
  SimulationMessage.create({
      type_message: type_message,
      source: source,
      destination: dest,
      content_msg: content_msg
  });
}

// Generateur de charer bits
function owner_bits(bits_list) {
  if (bits_list.length >= 3) {
      return '111';
  } else if (bits_list.length === 2) {
      if (['Local', 'Home'].every(bit => bits_list.includes(bit))) {
          return '110';
      } else if (['Local', 'Remote'].every(bit => bits_list.includes(bit))) {
          return '101';
      } else {
          return '011';
      }
  } else if (bits_list.length === 1) {
      if (bits_list.includes('Local')) {
          return '100';
      } else if (bits_list.includes('Home')) {
          return '010';
      } else {
          return '001';
      }
  } else {
      return '000';
  }
}

// Rread data 
function readData(request) {
  const node_id = parseInt(request.POST.get('node'));
  const block_id = parseInt(request.POST.get('block'));

  const node = Node.objects.get(id=node_id);
  const block = Directory.objects.get(id=block_id);


  if (block.state !== '3') {
      const caches_node = CacheNode.objects.filter(node=node).filter(bloc=block.bloc);
      if (caches_node.exists()) {
          const cache_node = caches_node.latest('id');
          if (cache_node.state_cache !== '2') {
              cache_node.state_cache = '2';
              cache_node.save();
          }
      } else {
          CacheNode.objects.create({
              node: node,
              bloc: block.bloc,
              state_cache: '2',
          });
      }

      const node_home = Node.objects.get(numero=0);
      MessageSimulation.objects.all().delete();
      message_sender(
          'Read Miss',
          `Cache ${node.name}`,
          `Repertoire ${node_home.name}`,
          `${node.node_string}, ${block.string_block}`
      );
      message_sender(
          'Data Value Reply',
          `Repertoire ${node_home.name}`,
          `Cache ${node.name}`,
          { content_msg: `${block.bloc.data}` }
      );
  } else {
      const caches_all = CacheNode.objects.filter(state_cache='3');
      let cache_owner = null;
      if (caches_all.exists()) {
          cache_owner = caches_all.latest('id');
      }

      const caches_node = CacheNode.objects.filter(node=node).filter(bloc=block.bloc);
      if (caches_node.exists()) {
          const cache_node = caches_node.latest('id');
          if (cache_node.state_cache !== '2') {
              cache_node.state_cache = '2';
              cache_node.save();
          }
      }

      const node_home = Node.objects.get(numero=0);
      if (cache_owner !== null) {
          MessageSimulation.objects.all().delete();
          message_sender(
              'Fetch',
              `Repertoire ${node_home.name}`,
              `Cache ${cache_owner.node.name}`,
              `${block.string_block}`
          );
          message_sender(
              'Data Write-Back',
              `Cache ${cache_owner.node.name}`,
              `Repertoire ${node_home.name}`,
              `${block.string_block}`
          );
          message_sender(
              'Data Value Reply',
              `Repertoire ${node_home.name}`,
              `Cache ${node.name}`,
              `${block.string_block}`
          );
      } else {
          CacheNode.objects.create({
              node: node,
              bloc: block.bloc,
              state_cache: '2',
          });

          if (cache_owner !== null) {
              MessageSimulation.objects.all().delete();
              message_sender(
                  'Fetch',
                  `Repertoire ${node_home.name}`,
                  `Cache ${cache_owner.node.name}`,
                  `${block.string_block}`
              );
              message_sender(
                  'Data Write-Back',
                  `Cache ${cache_owner.node.name}`,
                  `Repertoire ${node_home.name}`,
                  `${block.string_block}`
              );
              message_sender(
                  'Data Value Reply',
                  `Repertoire ${node_home.name}`,
                  `Cache ${node.name}`,
                  `${block.string_block}`
              );
          }
      }
  }

  const caches = CacheNode.objects.filter(bloc=block.bloc);
  const bits_list = [];
  if (caches.exists()) {
      for (const c of caches) {
          bits_list.push(c.node.name);
      }

      block.state = '2';
      block.owner_bits = owner_bits(bits_list);
      block.save();
  }
}


// Initialisation de donnees 
function reinitialisation_data(request) {
      Directory.objects.all().delete();
      MessageSimulation.objects.all().delete();
      MemoryBloc.objects.all().delete();

      Node.objects.all().delete();
      Node.objects.create({ name: 'Home', numero: 0 });
      Node.objects.create({ name: 'Local', numero: 1 });
      Node.objects.create({ name: 'Remote', numero: 2 });

      const block_0 = new MemoryBloc(0, 'D0');
      const block_1 = new MemoryBloc(1, 'D1');
      const block_2 = new MemoryBloc(2, 'D2');
      const block_3 = new MemoryBloc(3, 'D3');

      block_0.save();
      block_1.save();
      block_2.save();
      block_3.save();

      Directory.objects.create({ bloc: block_0, state: '1', owner_bits: '---' });
      Directory.objects.create({ bloc: block_1, state: '1', owner_bits: '---' });
      Directory.objects.create({ bloc: block_2, state: '1', owner_bits: '---' });
      Directory.objects.create({ bloc: block_3, state: '1', owner_bits: '---' });
}


