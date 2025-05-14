import request from 'supertest'
import server from '../server.js'
import { describe, it} from 'vitest'
import 'dotenv/config'

const getProfile = (user) => {
  it('should return the current user', (done) => {
    request(server)
      .get('/api/v1/protected/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.have.property('email').eql(user.email)
        done()
      })
  })
}

const getProfileSchemaMatch = (user) => {
  it('should match the expected schema', (done) => {
    const schema = {
      type: 'object',
      required: ['id', 'email', 'name'],
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        first_name: { type: 'string', minLength: 1, maxLength: 255 },
        last_name: { type: 'string', minLength: 1, maxLength: 255 },
      },
      additionalProperties: false,
    }
    request(server)
      .get('/api/v1/protected/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}

const updateProfile = (user) => {
  it('should update the current user', (done) => {
    const firstName = 'Updated'
    const lastName = 'Name'
    request(server)
      .post('/api/v1/protected/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          first_name: firstName,
          last_name: lastName
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(server)
          .get('/api/v1/protected/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('first_name').eql(firstName)
            res.body.should.have.property('last_name').eql(lastName)
            done()
          })
      })
  })
}

const updateProfileShouldIgnoreAdditionalProperties = (user) => {
  it('should ignore additional properties', (done) => {
    const firstName = 'Updated'
    const lastName = 'Name'
    request(server)
      .post('/api/v1/protected/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          first_name: firstName,
          last_name: lastName,
          additionalProperty: 'should not be saved',
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(server)
          .get('/api/v1/protected/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('first_name').eql(firstName)
            res.body.should.have.property('last_name').eql(lastName)
            res.body.should.not.have.property('additionalProperty')
            done()
          })
      })
  })
}

const updateProfileCannotChangeEmail = (user) => {
  it('should not allow changing the email', (done) => {
    const firstName = 'Updated'
    const lastName = 'Name'
    const email = 'updated-email@russfeld.me'
    request(server)
      .post('/api/v1/protected/profile/')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        request(server)
          .get('/api/v1/protected/profile/')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            res.body.should.have.property('first_name').eql(firstName)
            res.body.should.have.property('last_name').eql(lastName)
            res.body.should.have.property('email').eql(user.email)
            done()
          })
      })
  })
}

describe('/api/v1/protected/profile', () => {
  describe('user: test-admin', () => {
    let user = {
      email: 'test-admin@russfeld.me',
      token: null,
    }


    describe('GET /', () => {
      getProfile(user)
      getProfileSchemaMatch(user)
    })

    describe('POST /', () => {
      updateProfile(user)
      updateProfileShouldIgnoreAdditionalProperties(user)
      updateProfileCannotChangeEmail(user)
    })
  })

  describe('user: test-api', () => {
    let user = {
      email: 'test-api@russfeld.me',
      token: null,
    }


    describe('GET /', () => {
      getProfile(user)
      getProfileSchemaMatch(user)
    })

    describe('POST /', () => {
      updateProfile(user)
      updateProfileShouldIgnoreAdditionalProperties(user)
      updateProfileCannotChangeEmail(user)
    })
  })
})