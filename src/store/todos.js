/* eslint-disable no-unused-vars */
import moment from "moment";
import api from "@/api";

const dateFormat = "YYYY-MM-DD";

const taskConvert = (task) => {
  let newTask = { ...task, date: moment(task.date).format(dateFormat) };
  return newTask;
};
const getOldTask = (tasks) => {
  return tasks
    .filter((item) => !item.completed && moment().isAfter(item.date, "day"))
    .reverse();
};

export default {
  state: {
    isFormOfTaskVisible: false,
    hideCompletedTasks: true,
    moveableTaskId: null,
    editableTaskId: null,
    currentDate: moment(),
    tasks: [],
  },
  mutations: {
    toggleShowCompletedTasks(state) {
      state.hideCompletedTasks = !state.hideCompletedTasks;
    },
    pushTasks(state, payload) {
      state.tasks.push(...payload.map((item) => taskConvert(item)));
    },
    clearTasks(state) {
      state.tasks = [];
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
    getTasks({ commit, dispatch }) {
      api
        .get("/tasks")
        .then(({ data }) => {
          commit("pushTasks", data.data);
          const oldTasks = getOldTask(data.data);
          if (oldTasks.length) {
            for (let i = 0; i < oldTasks.length; i++) {
              dispatch("reorderTaskInDay", {
                targetDate: moment().format(dateFormat),
                taskId: oldTasks[i]._id,
                targetOrder: 0,
              });
            }
            dispatch("updateDayTasks", { date: moment().format(dateFormat) });
          }
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
    hideCompletedTasks: ({ hideCompletedTasks }) => hideCompletedTasks,
    isFormOfTaskVisible: ({ isFormOfTaskVisible }) => isFormOfTaskVisible,
    moveableTaskId: ({ moveableTaskId }) => moveableTaskId,
    slideDirection: ({ slideDirection }) => slideDirection,
    allTasks: ({ tasks }) => tasks,
    getDayTasks: (state) => (date) =>
      state.tasks
        .filter((item) => item.date === date)
        .filter((item) => (state.hideCompletedTasks ? !item.completed : true))
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
