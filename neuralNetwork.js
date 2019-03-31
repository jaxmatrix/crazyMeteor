//let debug = true;

class NeuralNetwork{
  constructor(layers,activationFunction=tf.sigmoid){

    this.layers = layers.length;
    this.neuralConfiguration = layers;
    this.layer = []
    let self = this;

    layers.forEach(function(ele){
      let layer = tf.zeros([ele])
      let activationMapping = []
      for(let i = 0; i< ele ; i++){
        //layer.push(0);
        activationMapping.push(null);
      }
      self.layer.push(layer);
    });

    this.weights = [];
    this.biases = [];

    for(let i=0; i<this.layers-1;i++){
      let randomWeights = tf.randomUniform([this.neuralConfiguration[i],this.neuralConfiguration[i+1]]);
      this.weights.push(randomWeights);

      let randomBiases = tf.randomUniform([this.neuralConfiguration[i+1]]);
      this.biases.push(randomBiases);
    }
  }

  activate(layer,neuron,fn){
    this.layer[layer].data().then((d)=>{
      fn(d[neuron]);
    });
  }

  //We will pass the first input layer of the neural network
  setInput(inputMatrix){
    if(inputMatrix.length == this.layer[0].shape){
      this.layer[0] = tf.tensor(inputMatrix);
    }
    else{
      console.log("Input matrix mismatch");
    }
  }

  //this part needs to be optimized for backpropagation
  /*
      TODA :
      1. Make table of Z;
      2. Prepare code for backpropagation
  */

  refreshNeuron(){
    let newLayers = [];
    newLayers.push(this.layer[0]);

    for(let i = 0; i < this.layers-1;i++){
      (debug)?console.log("Transfering (i,f):l",i,i+1,this.layers-i):null;
      let a  = this.weights[i];
      let b = this.layer[i].reshape([this.neuralConfiguration[i],1])
      let product = tf.matMul(a,b).reshape([1,this.neuralConfiguration[i+1],])

      if(debug){
        console.log("Layers under Evaluation");
        a.print();
        b.print();
        product.print();

      }

      let z = product.add(this.biases[i])
      newLayers.push(tf.sigmoid(z));

    }

    this.layer = newLayers;

    if(debug){
      this.layer.forEach((ele)=>{
        ele.print();
      });
    }
    //console.log("Updated Layer :: ", this.layer);
  }
}
