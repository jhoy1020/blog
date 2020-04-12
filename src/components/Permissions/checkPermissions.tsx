import rbacRules from './lib/rbacRules';

/**
 * Checks the user's role against the list of rbac rules.  If the action is in the
 * allowed list of actions it will return true.  Otherwise, false.
 * @param action The action the user is attempt to do.
 * @param data The necessary data to evaluate any dynamic rules.
 * @param role The user's role.
 * @param rules The set of rules to check the user's role against.
 */
const checkPermissions = (
  action: string,
  data: any,
  role: string,
  rules: any
) => {
  const permissions = rules[role];
  if (!permissions) {
    return false;
  }
  if (permissions.static && permissions.static.includes(action)) {
    return true;
  }
  if (permissions.dynamic) {
    const permissionCondition = permissions.dynamic[action];
    if (!permissionCondition) {
      return false;
    }
    return permissionCondition(data);
  }
  return false;
};

interface ICheckUserPermissionsArgs {
  action: string;
  data: any;
  role: string;
  rules?: any;
  renderComponent: JSX.Element;
  redirectComponent: JSX.Element;
}

/**
 * A component that determines which component to render based on the user's
 * role and permissions.
 * @param action The action trying to be performed.
 * @param data The data to evaluate with.
 * @param role The user's role.
 * @param rules The rbac rules to evaluate on.
 * @param renderComponent The component to render if the action is allowed.
 * @param redirectComponent THe component to render if the action is not allowed
 * for that rule.
 */
const CheckUserPermissions = ({
  action,
  data,
  role,
  rules = rbacRules,
  renderComponent,
  redirectComponent
}: ICheckUserPermissionsArgs): JSX.Element => {
  return checkPermissions(action, data, role, rules)
    ? renderComponent
    : redirectComponent;
};

export default CheckUserPermissions;
