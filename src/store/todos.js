/* eslint-disable no-unused-vars */
import moment from "moment";
import api from "@/api";

const dateFormat = "YYYY-MM-DD";

const setTodoDays = (baseDate = "", dayCount = 1) => {
  let resArr = [];
  let prevDays;
  switch (true) {
    case dayCount <= 5:
      prevDays = -2;
      break;
    default:
      prevDays = -3;
  }
  const tmpDate = moment(baseDate);
  tmpDate.add(prevDays, "day");
  for (let i = 0; i < dayCount; i++) {
    resArr.push({
      date: tmpDate.add(1, "day").format(dateFormat),
    });
  }
  return resArr;
};

const taskConvert = (task) => {
  let newTask = { ...task, date: moment(task.date).format(dateFormat) };
  return newTask;
};

export default {
  state: {
    isFormOfTaskVisible: false,
    slideDirection: null,
    moveableTaskId: null,
    editableTaskId: null,
    currentDate: moment(),
    todosDays: [],
    tasks: [],
  },
  mutations: {
    initTodoDays(state, count) {
      state.todosDays = setTodoDays(state.currentDate, count);
    },
    pushTasks(state, payload) {
      state.tasks.push(...payload.map((item) => taskConvert(item)));
    },
    shiftDate(state, { count, slides }) {
      if (count > 0) state.slideDirection = "right";
      else state.slideDirection = "left";

      state.currentDate.add(count, "day");

      state.todosDays = setTodoDays(
        state.currentDate.format(dateFormat),
        slides
      );
    },
    setDate(state, { newDate, slides }) {
      if (!newDate) newDate = moment().format(dateFormat);

      if (state.currentDate.isAfter(newDate, "day"))
        state.slideDirection = "left";
      else if (state.currentDate.isBefore(newDate, "day"))
        state.slideDirection = "right";

      state.currentDate = moment(newDate);
      state.todosDays = setTodoDays(
        state.currentDate.format(dateFormat),
        slides
      );
    },
    addTask({ tasks }, newTask) {
      tasks.push(newTask);
    },
    removeTask(state, taskId) {
      state.tasks = state.tasks.filter((item) => item._id !== taskId);
    },
    updateTask({ tasks }, task) {
      tasks = tasks.filter((item) => item._id !== task._id);
      tasks.push(task);
    },
    setMoveableTaskId(state, payload) {
      state.moveableTaskId = payload;
    },
    reorderTaskInDay(state, updatedArray) {
      const ids = updatedArray.map((item) => item._id);
      state.tasks = state.tasks.filter((item) => !ids.includes(item._id));
      state.tasks.push(...updatedArray);
    },
    changeTaskStatus(state, task) {
      let editableTask = state.tasks.find((item) => item._id === task._id);
      editableTask = task;
    },
    openTaskForm(state, taskId) {
      state.isFormOfTaskVisible = true;
      state.editableTaskId = taskId;
    },
    closeTaskForm(state) {
      state.isFormOfTaskVisible = false;
      state.editableTaskId = null;
    },
  },
  actions: {
    initTodoDays({ commit }, count) {
      commit("initTodoDays", count);
    },
    getTasks({ commit }) {
      api
        .get("/tasks")
        .then(({ data }) => {
          commit("pushTasks", data.data);
        })
        .catch((e) => commit("setError", e.message));
    },
    addTask({ commit, getters }, { content, date }) {
      const order = getters.lastIndexInDay(date) + 1;
      const newTask = {
        date,
        content,
        completed: false,
        order,
      };
      api.post("/tasks", newTask).then(({ data }) => {
        commit("addTask", taskConvert(data.data));
      });
    },
    removeTask({ commit }, taskId) {
      api
        .delete(`/tasks/${taskId}`)
        .then(commit("removeTask", taskId))
        .catch((e) => console.log(e.message));
    },
    updateTask(
      { commit, getters },
      { _id, content, completed, date, toBottom }
    ) {
      // {id, content, completed}
      let updatedTask = getters.taskById(_id);
      if (!updatedTask) throw new Error("Task not found");
      if ((!updatedTask.completed && completed && date) || toBottom)
        updatedTask.order = getters.lastIndexInDay(date) + 1;

      if (completed !== undefined) updatedTask.completed = completed;
      if (content) updatedTask.content = content;
      if (date) updatedTask.date = date;

      api
        .put(`tasks/${_id}`, updatedTask)
        .then(({ data }) => {
          commit("updateTask", data.data);
        })
        .catch((e) => {
          commit("setError", e.message);
        });
      if (getters.isFormOfTaskVisible) commit("closeTaskForm");
    },

    reorderTaskInDay({ commit, getters }, { targetDate, taskId, targetOrder }) {
      const movedTask = getters.allTasks.find((item) => item._id === taskId);
      let tmpArr = getters.getDayTasks(targetDate);
      let resArr = [];
      let ord = 0;
      if (!movedTask) return;
      if (movedTask.date !== targetDate || movedTask.order !== targetOrder) {
        movedTask.date = targetDate;
        for (let i = 0; i < tmpArr.length; i++) {
          if (tmpArr[i].order === targetOrder) {
            resArr.push({ ...movedTask, order: ord++ });
            resArr.push({ ...tmpArr[i], order: ord++ });
          } else if (taskId !== tmpArr[i]._id) {
            resArr.push({ ...tmpArr[i], order: ord++ });
          }
        }
        commit("reorderTaskInDay", resArr);
      }
    },
    updateDayTasks({ commit, getters }, { date }) {
      const days = getters.getDayTasks(date);
      api
        .put("/tasks", days)
        .then()
        .catch((e) => commit("setError", e.message));
    },
  },
  getters: {
    isFormOfTaskVisible: ({ isFormOfTaskVisible }) => isFormOfTaskVisible,
    currentDate: ({ currentDate }) => currentDate,
    todosDays: ({ todosDays }) => todosDays,
    moveableTaskId: ({ moveableTaskId }) => moveableTaskId,
    slideDirection: ({ slideDirection }) => slideDirection,
    allTasks: ({ tasks }) => tasks,
    getDayTasks: (state) => (date) =>
      state.tasks
        .filter((item) => item.date === date)
        .sort((a, b) => a.order - b.order),
    lastIndexInDay: (state) => (date) => {
      let res = Math.max(
        ...state.tasks
          .filter((task) => task.date === date)
          .map((task) => task.order)
      );
      return res !== -Infinity ? res : 0;
    },

    taskById: (state) => (id) => state.tasks.find((item) => item._id === id),
    editableTaskId: ({ editableTaskId }) => editableTaskId,
  },
};
