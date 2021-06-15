/* eslint-disable no-unused-vars */
import moment from "moment";
import api from "@/api";
import { clearConfigCache } from "prettier";

const DAYS_COUNT = 6;

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
const dateLimits = (baseDate) => {
  return {
    startDate: moment(baseDate).add(-DAYS_COUNT, "days").format(dateFormat),
    endDate: moment(baseDate)
      .add(DAYS_COUNT * 1.5, "days")
      .format(dateFormat),
  };
};
const getDaysCountFromDate = (date) => {
  if (!date && typeof date !== "string" && moment(date).isValid)
    throw new Error("bad format data");
  return moment(date).valueOf() / (1000 * 60 * 60 * 24);
};

export default {
  state: {
    isFormOfTaskVisible: false,
    hideCompletedTasks: true,
    moveableTaskId: null,
    editableTaskId: null,
    globalBaseDate: moment(),
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
    addTasks({ tasks }, newTasks) {
      newTasks.forEach((item) => {
        tasks.push(taskConvert(item));
      });
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
    setGlobalBaseDate(state, date) {
      state.globalBaseDate = moment(date);
    },
  },
  actions: {
    changeStoreBaseDate({ commit, state, dispatch }, date) {
      if (date && typeof date === "string") {
        const newCountDays = getDaysCountFromDate(date);
        const baseCountDays = getDaysCountFromDate(
          state.globalBaseDate.format(dateFormat)
        );
        const diff = Math.abs(newCountDays - baseCountDays);
        if (diff >= DAYS_COUNT / 1.5) {
          commit("setGlobalBaseDate", date);
          dispatch("getTasks");
        }
      }
    },
    getTasks({ commit, dispatch, state }) {
      commit("clearTasks");
      api
        .get("/tasks", {
          params: dateLimits(state.globalBaseDate.format(dateFormat)),
        })
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
    addTask({ commit, getters, state }, { content, date, repeat }) {
      const order = getters.lastIndexInDay(date) + 1;
      const newTask = {
        date,
        content,
        completed: false,
        order,
      };
      api
        .post("/tasks", newTask, {
          params: dateLimits(state.globalBaseDate.format(dateFormat)),
        })
        .then(({ data }) => {
          commit("addTasks", data.data);
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
