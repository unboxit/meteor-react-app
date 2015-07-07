var Tasks = new Meteor.Collection("tasks");

var List = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function () {
    return {
      tasks: Tasks.find().fetch()
    };
  },
  render: function () {
    return (
      <ul className="list-group">
        {this.data.tasks.map(function (task) {
          return (
            <li className="list-group-item" key={task._id}>
              {task.content}
            </li>
          );
        })}
      </ul>
    );
  }
});

var NewTaskForm = React.createClass({
  onSubmit: function (event) {
    event.preventDefault();

    var taskContent = React.findDOMNode(this.refs.content).value;

    Meteor.call("insertTask", {
      content: taskContent
    });

    React.findDOMNode(this.refs.content).value = "";
  },
  render: function () {
    return (
      <form onSubmit={this.onSubmit} className="input-group">
        <input type="text" ref="content"
          className="form-control"
          placeholder="Add a task..." />
      </form>
    );
  }
});

var App = React.createClass({
  render: function () {
    return (
      <section className="col-xs-10 col-xs-offset-1">
        <NewTaskForm />
        <List />
      </section>
    );
  }
});

Meteor.methods({
  insertTask: function (task) {
    check(task, {
      content: String
    });
    Tasks.insert(task);
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.body);
  });
}
