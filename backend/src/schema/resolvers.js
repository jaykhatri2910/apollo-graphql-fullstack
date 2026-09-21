const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server-express');

const resolvers = {
  Query: {
    employees: async (_, { page = 1, pageSize = 10, filter, sortBy }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const query = {};
      
      // RBAC: If not admin, only show own record
      if (user.role !== 'admin') {
        query._id = user.id;
      }

      if (filter) {
        if (filter.name) query.name = { $regex: filter.name, $options: 'i' };
        if (filter.minAge) query.age = { ...query.age, $gte: filter.minAge };
        if (filter.maxAge) query.age = { ...query.age, $lte: filter.maxAge };
        if (filter.role) query.role = filter.role;
        if (filter.attendanceMin) query.attendance = { ...query.attendance, $gte: filter.attendanceMin };
        if (filter.attendanceMax) query.attendance = { ...query.attendance, $lte: filter.attendanceMax };
      }

      const sort = {};
      if (sortBy) {
        sort[sortBy.field] = sortBy.order === 'asc' ? 1 : -1;
      } else {
        sort.date = -1; // Default sort by date desc
      }

      const totalCount = await Employee.countDocuments(query);
      const totalPages = Math.ceil(totalCount / pageSize);
      const employees = await Employee.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return { employees, totalCount, totalPages };
    },
    employee: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      // RBAC: If not admin, can only view self
      if (user.role !== 'admin' && user.id !== id) {
        throw new ForbiddenError('Not authorized to view this employee');
      }
      return await Employee.findById(id);
    },
    me: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await Employee.findById(user.id);
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      console.log({email, password})
      const employee = await Employee.findOne({ email });
      console.log('employee->', employee)
      if (!employee) throw new UserInputError('Invalid credentials');

      const valid = await bcrypt.compare(password, employee.password);
      if (!valid) throw new UserInputError('Invalid credentials');

      const token = jwt.sign(
        { id: employee.id, role: employee.role },
        process.env.JWT_SECRET || 'supersecretkey123',
        { expiresIn: '1d' }
      );

      return { token, user: employee };
    },
    addEmployee: async (_, args, { user }) => {
      if (!user || user.role !== 'admin') throw new ForbiddenError('Not authorized');

      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newEmployee = new Employee({ ...args, password: hashedPassword });
      return await newEmployee.save();
    },
    updateEmployee: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      // RBAC: Admin can update anyone. Employee can only update self.
      if (user.role !== 'admin' && user.id !== id) {
        throw new ForbiddenError('Not authorized to update this employee');
      }

      // If not admin (meaning it's self-update), strip out restricted fields
      // Allowing only: name (first/last implied by single name field in this schema)
      if (user.role !== 'admin') {
        const allowedUpdates = {};
        if (updates.name) allowedUpdates.name = updates.name;
        
        // If they try to update anything else that isn't allowed, we could throw or just ignore. 
        // For strictness, if they try to update role/attendance/etc, we ignore it.
        // We replace 'updates' with 'allowedUpdates'.
        
        // Check if there are meaningful updates
        if (Object.keys(allowedUpdates).length === 0) {
           // If they tried to update something else but we stripped it
           // In this specific request user asked for "first name and last name", but schema has "name".
           // We will update 'name'. 
           if (Object.keys(updates).length > 0) {
             throw new ForbiddenError('You are only allowed to update your name.');
           }
        }
        updates = allowedUpdates;
      }

      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteEmployee: async (_, { id }, { user }) => {
      if (!user || user.role !== 'admin') throw new ForbiddenError('Not authorized');
      await Employee.findByIdAndDelete(id);
      return true;
    },
  },
};

module.exports = resolvers;
