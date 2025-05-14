import request from 'supertest'
import server from '../server.js'
import { describe, it, beforeEach, beforeAll} from 'vitest'
import 'dotenv/config'
import db from '../configs/db.js'

// Set up environment variables
process.env.FORCE_AUTH = 'true'

//Creates a mock user
let adminUser = {
  eid:'test-admin',
  first_name: 'Test',
  last_name: 'Administrator',
  created_by: 'test-admin',
  updated_by: 'test-admin',
  id: 1, 
  is_admin: true,
  token: 'test-token',
  }

  beforeAll(async () => {
    db.migrate.latest()
  })
  
  beforeEach(async () => {
    db.seed.run()
    
  })

  //Tests that get requests return a list of all users
  const getAllUsers = (adminUser) => {
    it('should list all users', (done) => {
      request(server)
        .get('/api/v1/protected/users/')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .expect(200)
        .end((err, res) => {
        if (err) {return done(err)}
         expect(res.body).toBeInstanceOf(Array)
         expect(res.body.length).toBe(2)
         done(err)
        })
    })
  }
  

  //Tests that all users' schema are correct
  const getAllUsersSchemaMatch = (adminUser) => {
  it('all users should match schema', (done) => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'eid',
          'first_name',
          'last_name'
        ],
        properties: {
          id: { type: 'integer' },
          eid: {type: 'string', minLength: 3, maxLength: 20},
          first_name: { type: 'string', minLength: 1, maxLength: 255 },
          last_name: { type: 'string', minLength: 1, maxLength: 255 },
          roles: {type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer'},
                name: { type: 'string'}
              }
            }
          }
        },
      },
      additionalProperties: false,
    }
    request(server)
      .get('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}
//Tests that put requests work
const putUser = (adminUser) => {
  it('should create a user', (done) => {
    const r = {id: '1', name: 'admin'}
    const newuser = {
      id: '1',
      eid: 'testeid',
      first_name: 'test',
      last_name: 'user',
      roles: [r]
    }
    request(server)
      .put('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({
        user: newuser,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.an('array')
        res.body.should.have.lengthOf(3)
        done()
      })
  })
}


//Tests what put requests ignore any additional properties 
const addUserIgnoresAdditionalProperties = (adminUser) => {
  it('should ignore additional properties on new user', (done) => {
    const r = {id: '1', name: 'admin'}
    const newuser = {
      id: '1',
      eid: 'testeid',
      first_name: 'test',
      last_name: 'user',
      extraProperty: "extraProperty",
      roles: [r]
    }
    request(server)
      .put('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newuser })
      .end((err, res) => {
        if (err) return done(err)
        res.status.should.equal(201)
        request(server)
          .get('/api/v1/protected/users/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(5)
            const addeduser = res.body.find((u) => u.first_name === newuser.first_name)
            addeduser.should.not.have.property('extraProperty')
            addeduser.roles[0].should.not.have.property('extraProperty')
            done()
          })
      })
  })
}

//Tests that put requests don't allow users of the same Eid
const addUserFailsOnDuplicateEid = (adminUser) => {
  it('should fail on duplicate name', (done) => {
    const r = {id: '1', name: 'admin'}
    const newuser = {
      id: '1',
      eid: 'test-admin',
      first_name: 'test',
      last_name: 'user',
      roles: [r]
    }
    request(server)
      .put('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newuser })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests don't work if the name or eid is missing
const addUserFailsOnMissingProperties = (adminUser) => {
  it('should fail on missing properties', (done) => {
    const r = {id: '1', name: 'admin'}
    const newuser_noeid = {
      id: '1',
      first_name: 'test',
      last_name: 'user',
      roles: [r]
    }
    request(server)
      .put('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newuser_noeid })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
          const r = {id: '1', name: 'admin'}
        const newuser_noname = {
          id: '1',
          eid: 'testeid',
          roles: [r]
        }
        request(server)
          .put('/api/v1/protected/users/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .send({ adminUser: newuser_noname })
          .expect(422)
          .end((err) => {
            if (err) return done(err)
            done()
        })
      })
    })
  }

  //Tests if post requests work
  const updateUser = (adminUser) => {
    it('should update a user', (done) => {
      const r = {id: '1', name: 'admin'}
      const newuser = {
        id: '1',
        eid: 'testeid',
        first_name: 'test',
        last_name: 'user',
        roles: [r]
      }
      request(server)
        .post('/api/v1/protected/users/' + newuser.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newuser })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(server)
            .get('/api/v1/protected/users/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id === newuser.id)
              addeduser.should.shallowDeepEqual(newuser)
              done()
            })
        })
    })
  }
  //Tests that post requests ignore any additional properties
  const updateUserIgnoresAdditionalProperties = (adminUser) => {
    it('should ignore additional properties on updated user', (done) => {
      const r = {id: '1', name: 'admin'}
    const newuser = {
      id: '1',
      eid: 'testeid',
      first_name: 'test',
      last_name: 'user',
      extraProperty: 'extra property',
      roles: [r]
    }
      request(server)
        .post('/api/v1/protected/users/' + newuser.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newuser })
        .end((err, res) => {
          if (err) return done(err)
          res.status.should.equal(200)
          request(server)
            .get('/api/v1/protected/users/')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              res.body.should.be.an('array')
              res.body.should.have.lengthOf(3)
              const addeduser = res.body.find((u) => u.id == newuser.id)
              addeduser.should.not.have.property('extraProperty')
              addeduser.should.have.property('first_name').eql('test')
              addeduser.should.have.property('last_name').eql('user')
              addeduser.roles[0].should.not.have.property('extraProperty')
              done()
            })
        })
    })
  }

  //Tests that post requests fail if the name or eid is missing
  const updateUserFailsOnMissingProperties = (adminUser) => {
    it('should fail on missing properties', (done) => {
      const r = {id: '1', name: 'admin'}
    const newuser_noeid = {
      id: '1',
      first_name: 'test',
      last_name: 'user',
      roles: [r]
    }
      request(server)
        .post('/api/v1/protected/users/' + newuser_noeid.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newuser_noeid })
        .expect(422)
        .end((err) => {
          if (err) return done(err)
            const r = {id: '1', name: 'admin'}
          const newuser_noname = {
            id: '1',
            eid: 'testeid',
            roles: [r]
          } 
          request(server)
        .post('/api/v1/protected/users/' + newuser_noname.id)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ adminUser: newuser_noeid })
        .expect(422)
        .end((err) => {
          if (err) return done(err) 
          done()         
        })
    })
  })
}

//Tests that post requests fail if the id is invalid
const updateUserFailsOnInvalidName = (adminUser) => {
  it('should fail on invalid name', (done) => {
    const r = {id: '1', name: 'admin'}
      const newuser = {
        id: '1',
        eid: 'testeid',
        first_name: 'Invalid',
      last_name: 'Name',
        roles: [r]
      }
    request(server)
      .post('/api/v1/protected/users/' + newuser.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({ adminUser: newuser })
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteUser = (adminUser) => {
  it('should delete a user', (done) => {
    request(server)
      .delete('/api/v1/protected/users/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(server)
          .get('/api/v1/protected/users/')
          .set('Authorization', `Bearer ${adminUser.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.be.an('array')
            res.body.should.have.lengthOf(2)
            const deleteduser = res.body.find((u) => u.id === 2)
            assert.isUndefined(deleteduser)
            done()
          })
      })
  })
}

const deleteUserFailsOnInvalidId = (adminUser) => {
  it('should fail on invalid id', (done) => {
    request(server)
      .delete('/api/v1/protected/users/999')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(422)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


//Test that get requests only work for users with admin role
const getAllUsersRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(server)
      .get('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that put requests only work for users with admin role
const putUserRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(server)
      .put('/api/v1/protected/users/')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

//Tests that post requests are only allowed for users with admin role
const postUserRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(server)
      .post('/api/v1/protected/users/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}


const deleteUserRequiresAdminRole = (adminUser) => {
  it('should require the admin role', (done) => {
    request(server)
      .delete('/api/v1/protected/users/1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(403)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
}

  describe('GET /', () => {
    getAllUsers(adminUser)
    getAllUsersSchemaMatch(adminUser)
    getAllUsersRequiresAdminRole(adminUser)
  })

  describe('PUT /', () => {
    putUser(adminUser)
    addUserIgnoresAdditionalProperties(adminUser)
    putUserRequiresAdminRole(adminUser)
    addUserFailsOnDuplicateEid(adminUser)
    addUserFailsOnMissingProperties(adminUser)
  })


  describe('POST /{id}', () => {
    updateUser(adminUser)
    updateUserIgnoresAdditionalProperties(adminUser)
    updateUserFailsOnMissingProperties(adminUser)
    updateUserFailsOnInvalidName(adminUser)
    postUserRequiresAdminRole(adminUser)
  })

  describe('DELETE /{id}', () => {
    deleteUser(adminUser)
    deleteUserFailsOnInvalidId(adminUser)
    deleteUserRequiresAdminRole(adminUser)
  })