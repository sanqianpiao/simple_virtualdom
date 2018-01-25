let virtualDom = {
  tag:'ul',
  children:[
    {tag:'li', children: ['banana' , { tag: 'span', children: [ 'mango' ] }, 'good']},
    {tag:'li', children:['apple']}
  ]
}

let virtualDom2 = {
  tag:'ul',
  children:[
    {tag:'li', children: ['banana' , { tag: 'span', children: [ 'mango' ] }, 'good']},
    {tag:'li', children:['apple']},
    {tag:'li', children:['hello world']}
  ]
}

let virtualDom3 = {
  tag:'ul',
  children:[
    {tag:'li', children: ['banana' , { tag: 'span', children: [ 'mango' ] }, 'good']}
  ]
}

////////////////////////////////////////////////////////////////////////////////

var render = (function() {
  let oldVirtualDom;

  function render(virtualDom, document) {

    function added(node1, node2) {
      let len1 = node1.children.length;
      let len2 = node2.children.length;
      let newchildren = node2.children.slice(len1);
      newchildren.forEach(function(child) {
          let newnode = createDomNode(child);
          node1._node.appendChild(newnode);

          child._node = newnode;
          node1.children.push(child);
      })
    }

    function deleted(node1, node2) {
      let len1 = node1.children.length;
      let len2 = node2.children.length;
      let removedchildren = node1.children.slice(len2);
      removedchildren.forEach(function(child, index) {
          node1._node.removeChild(child._node);
          node1.children.splice(index, 1);
      })
    }

    // This function compares the difference of node1, node2
    // Currently, it can only simply add or remove nodes
    function compare(node1, node2) {

      // new added
      let len1 = node1.children.length;
      let len2 = node2.children.length
      if(len1 < len2) {
          added(node1, node2)
      }

      // deleted
      if(len2 < len1) {
        deleted(node1, node2);
      }

      //content changed
      // Here I still need sometime to think about it.
    }

    function createDomNode(virtualDom) {

      let tag = virtualDom.tag;
      if(!tag) {
        return document.createTextNode(virtualDom);
      }

      let node = document.createElement(tag);
      if(!!virtualDom.children && virtualDom.children.length > 0) {
        virtualDom.children.forEach(function(child) {
            node.appendChild(createDomNode(child));
        })
      }
      virtualDom._node = node;
      return node;
    }

    if(oldVirtualDom != null) {
      compare(oldVirtualDom, virtualDom)
      return;
    }

    let dom = createDomNode(virtualDom);
    oldVirtualDom = virtualDom;
    return dom;
  }

  return render;
})(document)


////////////////////////////////////////////////////////////////////////////////

function init(virtualDom) {
  document.querySelector('#container').appendChild(render(virtualDom, document));
}

init(virtualDom);

document.querySelector('#btnAdd').addEventListener('click', function() {
  render(virtualDom2, document)
});

document.querySelector('#btnDelete').addEventListener('click', function() {
  render(virtualDom3, document)
});
