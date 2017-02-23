if (window.AL === undefined){window.AL = {}; }

(() => {
  var ControlObject;
  var sendData;
  var emitter = new Emitter;

  window.AL.ControlObject = {
    mapMarkers:[],
    locationObjects:[],
    sendData: sendData,
    callbacks: [],
    emitter:emitter,
    resetControl: function(){

      this.callbacks = [];
      this.sendData = {};
      console.log('control data and callbacks cleared');
    },

    getAll:function(){

      if (this.sendData !== undefined) {
        emitter.emit('loaded');
        return;
      }

      // console.log('gettin everything');
      //api get all
      $.ajax({
        url: '/api/sites',
        method: 'GET',
        dataType: 'JSON'
      })
      .done((data)=> {
        console.log("ajax get all done, recieved: \n ",data, "type of", typeof data);
        this.sendData = data;
        this.locationObjects = this.sendData.sites;
        emitter.emit('loaded');
        // console.log('grabbd everything',data);
      })
      .fail(()=>{
        console.log('cant get');
      })
    },//end of get all

    getStructById: function(itemId){

      $.ajax({
        url:'/api/sites/' + itemId,
        method:'GET',
        dataType:'JSON',
      })
      .done((data)=>{
        console.log("found ", data);
        this.sendData = data;
        emitter.emit('foundId');
        console.log('control callbacks test, callbacks are done ',this.callbacks);
      })
      .fail((req,stat,err)=>{
        console.log('failed to get req,', req);
        this.sendData = (req,stat,err);
        emitter.emit('foundId');
        //??
      })
    },
    deleteItem: function(itemId){

      $.ajax({
        url:'/api/sites/' + itemId +"/delete",
        method: 'DELETE',
        dataType:'JSON'
      })
      .done((data) => {
        console.log('callbacksEdit',this.callbacksEdit);
        console.log('deleted, ',data);
        this.sendData = data;
        emitter.emit('deleted');

      })
      .fail((req,stat,err) => {
        console.log('delete failure');
        this.sendData = (req,stat,err);
        emitter.emit('deleted');
      });
    },//end of delete
    addItem: function(inputs){
      //test
      console.log("sending...", inputs);

      //api POST NEW
      $.ajax({
        url: '/api/sites',
        method: 'POST',
        dataType: 'JSON',
        data:{
          title:inputs.title,
          type:inputs.type,
          year:inputs.year,
          arch:inputs.arch,
          street:inputs.street,
          cityState:inputs.cityState,
          country:inputs.country,
          pic:inputs.pic,
          description:inputs.description
        }

      })
        .fail((req,stat,error)=>{
          // window.alert('no');
          console.log('request unsucessful');
          console.log("req",req);
          console.log("stat",stat);
          console.log("err",error);
          this.sendData = (req,stat,error);
          emitter.emit('added');
        })
        .done((data)=>{
          console.log('request successful');
          console.log('data: ',data);
          this.sendData = data;
          emitter.emit('added');

        })
      },//end of addItem
      editItem: function(itemId,inputs){

        $.ajax({
          url: '/api/sites/' + itemId + '/edit',
          method:'PUT',
          dataType:'JSON',
          data:{
            title:inputs.title,
            type:inputs.type,
            year:inputs.year,
            arch:inputs.arch,
            street:inputs.street,
            cityState:inputs.cityState,
            country:inputs.country,
            pic:inputs.pic,
            description:inputs.description
          }
        })
        .fail((req,stat,error)=>{
          // window.alert('no');
          console.log('request unsucessful');
          console.log("req",req);
          console.log("stat",stat);
          console.log("err",error);
          this.sendData = (req,stat,err);
          emitter.emit('saved');
        })
        .done((data)=>{
          console.log('request successful');
          console.log('data: ',data);
          this.sendData = data;
          emitter.emit('saved');

        })
      },//end of editor
      setStyleTags: function(itemId,tags){
        console.log('set tags of ',itemId,' to ',tags)
        $.ajax({
          url:'/api/sites/'+itemId+'/tag',
          method:'PUT',
          dataType:'JSON',
          data:{
            styles:tags
          }
        })
        .fail((req,stat,error)=>{
          // window.alert('no');
          console.log('request unsucessful');
          console.log("req",req);
          console.log("stat",stat);
          console.log("err",error);
          this.sendData = (req,stat,err);
          this.callbacksEdit();
        })
        .done((data)=>{
          console.log('request successful');
          console.log('data: ',data);
          this.sendData = data;
          this.callbacksEdit();

        })
      },

      mapOneItem: function(itemId){

        $.ajax({
          url:'/api/sites/' + itemId + '/view-map',
          method:'GET',
          dataType:'JSON',
        })
        .done((data)=>{
          console.log("found ", data);
          ReactRouter.hashHistory.push('/map/view-one/'+ itemId);
          emitter.emit('mapOne');
        })
        .fail((req,stat,err)=>{
          console.log('failed to get req,', req);
          this.sendData = (req,stat,err);
          emitter.emit('mapOne');
          //??
        })

      },//end of map one view

    } //end of control object
  }
)();
