<template>
  <div name="modal">
        <div class="modal-mask" @click="close" v-show="show">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>Список подключенных пабликов</h3>
                </div>
                <div class="modal-body">
                  <ol class="public_list">
                    <li class="liItem" v-for='public in publics_id'>
                      <div class="name_block">
                        <span>{{ public.name }}</span>
                      </div>
                      <div class="list_item">
                        <label>
                          <a @click="removePublic(public.id)"><span class="glyphicon glyphicon-remove-circle"/></a>
                        </label>
                        <input type="text" class="form-control" v-model='public.id' />
                      </div>
                    </li>
                    
                    <a @click="addPublic"><span class="glyphicon glyphicon-plus-sign"/></a>
                  </ol>
                    
                </div>
                <div class="text-left">
                      В списке {{ this.publics_id.length }} пабликов
                </div>
                <div class="modal-footer text-right">
                    <a class="modal-default-button close_btn" @click="saveList">
                        Сохранить
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	
export default { 
	name: 'modal',
	props: {
    	show: {
	      type: Boolean,
	      default: false
	    },
      publics_id: {
        type: Array,
        default: []
      },
      mypublic_id: {
        type: String,
        default: ''
      }
  	},
   data: function () {
    return {
      title: '',
      body: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.title = '';
      this.body = '';
    },
    saveList() {
      this.$emit('save', this.publics_id);
      this.close();
    },
    addPublic() {
      this.publics_id.push({ name: '', id: '' });
    },
    removePublic(id) {
      for (var i = 0; i < this.publics_id.length; i++) {
        if (this.publics_id[i].id == id) { 
            this.publics_id.splice(i, 1);
            break;
        }
      }
      console.log(this.publics_id);
    },
  },
  mounted: function () {
    document.addEventListener("keydown", (e) => {
      if (this.show && e.keyCode == 27) {
        this.close();
      }
    });
  }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.modal-mask {
    position: absolute;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.modal-container {
    width: 35%;
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
  margin: 1px 0;
  max-height: 100%;
}

.text-right {
    text-align: right;
}
.text-left {
  text-align: left;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.public_list {
  list-style-type: none;
}
.public_list li {
  margin-right: 20%;
  padding-top: 5%;
}
.close_btn {
  cursor: pointer;
  color: #999;
  padding: 0 20px;
  max-width: 160px;
  background-color: transparent;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-decoration: none;
  margin: 0 6px;
  transition: all .2s ease-in-out;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 300;
  line-height: 42px;
  height: 44px;
  font-size: 22px;
}
.close_btn:hover {
  border-color: #42b983;
  color: #42b983;
}
.glyphicon.glyphicon-plus-sign {
  font-size: 35px;
  margin-right: 30%;
  margin-top: 5%;
}
.glyphicon-remove-circle {
  color: red;
}
.list_item {
  flex: 1;
  
}
.list_item label{
  float: right;
  width: 20%;
  margin-top: 3%;
}
.list_item input {
  display: block;
  width: 80%;
}
.liItem {
  display: flex;
}
.name_block {
  flex: 1;
  text-align: left;
}

</style>