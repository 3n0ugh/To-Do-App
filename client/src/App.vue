<template>
  <section class="content">
    <h1> TO-DO APP </h1>
    <div class="mt-2 col-2">
      <button  @click="showForm = !showForm" class="btn btn-info">
        Toggle Form
      </button>
    </div>
    <form v-if="showForm" @submit.prevent="addTodo()">
      <div class="mb-3 col-8">
        <br/>
        <label for="title" class="form-label">Title</label>
        <input
          v-model="newTodo.title"
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="titleHelp"
          placeholder="Enter a title." required
        />
        <div id="titleHelp" class="form-text text-muted">
          Enter a descriptive title for your todo.
        </div>
      </div>
      <div class="form-group col-8">
        <label for="note" class="form-label">ToDo</label>
        <textarea
          v-model="newTodo.note"
          class="form-control"
          id="note"
          rows="3"
          placeholder="Enter your todo here."
        ></textarea>
      </div>
      <div class="mt-2">
        <button type="submit" class="btn btn-success">
          Add ToDo
        </button>
      </div>
    </form>
    <section class="row mt-3">
      <div
        class="col-6"
        v-for="note in notes"
        :key="note._id"
      >
        <div
          class="card text-white bg-dark mb-3"
          >
          <div class="card-header"> 
            <p class="card-text" v-html="renderMarkdown(note.title)"/>
          </div>
          <div class="card-body">
            <p class="card-text" v-html="renderMarkdown(note.note)"/>
          </div>
          <button @click="removeTodo(note._id)" class="btn btn-danger">
          Remove
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import MarkdownIt from 'markdown-it';
import MDemoji from 'markdown-it-emoji';

const md = new MarkdownIt();
md.use(MDemoji);

const API_URL = 'http://localhost:5000';

export default {
  data: () => ({
    showForm: false,
    newTodo: {
      title: '',
      note: '',
    },
    notes: [],
  }),
  mounted() {
    fetch(`${API_URL}/api/v1/to-do`)
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          console.log(result)
          this.getNotes();
        } 
      });
  },
  methods: {
    renderMarkdown(note) {
      return md.render(note);
    },
    getNotes() {
      fetch(`${API_URL}/api/v1/to-do`)
      .then((res) => res.json())
      .then((notes) => {
        this.notes = notes;
      });
    },
    addTodo() {
      fetch(`${API_URL}/api/v1/to-do`, {
        method: 'POST',
        body: JSON.stringify(this.newTodo),
        headers: {
          'content-type': 'application/json',
        },
      }).then((res) => res.json())
        .then((note) => {
          this.notes.push(note);
          this.newTodo = {
            title: '',
            note: '',
          };
          this.showForm = false;
        });
    },
    removeTodo(id) {
      fetch(`${API_URL}/api/v1/to-do`, {
        method: 'DELETE',
        body: JSON.stringify({
          _id: id
        }),
        headers: {
          'content-type': 'application/json',
        },
      }).then(() => {
          this.notes = this.notes.filter( (notes) => {
            if(notes._id != id){
              return notes
            }
          })
        })
    }
  }
}
</script>

<style>
.card {
  height: 30%;
  width: 70%;
}
.card-text img{
  width: 30%;
}
.form-control{
  color: #fff;
}
.content {
  max-width: 1500px;
  margin: auto;
}
</style>
