// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SequenceDiagram} from './SequenceDiagram';

export function AuthZENFlowDiagram() {
  return (
    <SequenceDiagram
      actors={['Client', 'PEP', 'PDP', 'Protected Resource']}
      gaps={[260, 280, 280]}
      ariaLabel="AuthZEN authorization lifecycle: a client requests a protected resource through a policy enforcement point. The policy enforcement point asks a policy decision point for an access decision. A false decision causes the policy enforcement point to deny access. A true decision allows the policy enforcement point to forward the request to the protected resource and return its response."
      rows={[
        {from: 0, to: 1, label: 'Request protected resource'},
        {
          from: 1,
          to: 2,
          label: 'POST /access/v1/evaluation',
          sublabel: ['subject, resource, action,', 'optional context'],
        },
        {
          from: 2,
          to: 1,
          label: 'Access decision',
          sublabel: ['decision: true | false,', 'optional context'],
        },
        {from: 1, to: 0, label: 'Deny access if false'},
        {from: 1, to: 3, label: 'Forward request if true'},
        {from: 3, to: 1, label: 'Resource response'},
        {from: 1, to: 0, label: 'Return resource response'},
      ]}
    />
  );
}
